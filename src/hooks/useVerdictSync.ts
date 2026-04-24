import { useEffect, useState, useCallback, useRef } from 'react';

interface VerdictData {
  submissionId: string;
  status: string;
  testResults?: {
    totalTests: number;
    passedTests: number;
    testCases?: Array<{ id: number; status: string }>;
  };
  compilationError?: string;
  runtimeError?: string;
  score?: number;
}

interface UseVerdictSyncOptions {
  wsTimeout?: number;
  pollInterval?: number;
  maxRetries?: number;
  onVerdictReceived?: (verdict: VerdictData) => void;
}

/**
 * useVerdictSync Hook - Real-time submission verdict synchronization
 * Listens for WebSocket updates with automatic polling fallback
 * Retries on failure and emits events for cross-view updates
 */
export function useVerdictSync(
  submissionId: string,
  options: UseVerdictSyncOptions = {},
) {
  const {
    wsTimeout = 5000,
    pollInterval = 2000,
    maxRetries = 5,
    onVerdictReceived,
  } = options;

  const [status, setStatus] = useState<string>('PENDING');
  const [verdict, setVerdict] = useState<VerdictData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);

  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollRetriesRef = useRef(0);
  const isMountedRef = useRef(true);

  // Handle verdict from any source (WebSocket or polling)
  const handleVerdictUpdate = useCallback((data: VerdictData) => {
    if (data.submissionId !== submissionId || !isMountedRef.current) return;

    setStatus(data.status);
    setVerdict(data);
    setIsPolling(false);
    setPollAttempts(0);
    pollRetriesRef.current = 0;

    // Cleanup timers
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current);

    // Call callback
    onVerdictReceived?.(data);

    // Emit custom event for other components
    window.dispatchEvent(
      new CustomEvent('verdict-received', {
        detail: data,
      }),
    );
  }, [submissionId, onVerdictReceived]);

  // Poll for verdict status
  const poll = useCallback(async (attempt: number = 1) => {
    if (!isMountedRef.current) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/submissions/${submissionId}`);

      if (!response.ok) throw new Error('Poll failed');

      const data = await response.json();
      if (data.data?.status && data.data.status !== 'PENDING') {
        handleVerdictUpdate({
          submissionId,
          ...data.data,
        });
        return;
      }

      // Still pending, schedule next poll
      if (attempt < maxRetries) {
        setPollAttempts(attempt + 1);
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

        pollTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            poll(attempt + 1);
          }
        }, pollInterval);
      }
    } catch (error) {
      // Retry on error
      if (attempt < maxRetries) {
        setPollAttempts(attempt + 1);
        if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

        // Exponential backoff (1s, 2s, 4s, etc)
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);

        pollTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            poll(attempt + 1);
          }
        }, backoffDelay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, maxRetries, pollInterval, handleVerdictUpdate]);

  // Listen for WebSocket updates
  useEffect(() => {
    isMountedRef.current = true;

    // Listen for verdict update events from WebSocket
    const handleWebSocketUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail as VerdictData;
      handleVerdictUpdate(data);
    };

    window.addEventListener('verdict-update', handleWebSocketUpdate);

    // Start WebSocket timeout timer
    wsTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && status === 'PENDING') {
        setIsPolling(true);
        poll();
      }
    }, wsTimeout);

    return () => {
      window.removeEventListener('verdict-update', handleWebSocketUpdate);
    };
  }, [submissionId, wsTimeout, status, poll, handleVerdictUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current);
    };
  }, []);

  return {
    status,
    verdict,
    isLoading,
    isPolling,
    pollAttempts,
  };
}
