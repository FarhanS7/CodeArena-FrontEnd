'use client';

import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';

interface VerdictData {
  submissionId: string;
  status: string;
  testResults?: any;
  compilationError?: string;
  runtimeError?: string;
  score?: number;
  timestamp?: string;
}

interface SubmissionVerdictContextType {
  verdicts: Map<string, VerdictData>;
  registerSubmission: (submissionId: string) => void;
  unregisterSubmission: (submissionId: string) => void;
  broadcastVerdict: (verdict: VerdictData) => void;
  getVerdict: (submissionId: string) => VerdictData | undefined;
}

const SubmissionVerdictContext = createContext<SubmissionVerdictContextType | null>(null);

/**
 * SubmissionVerdictProvider - Global verdict state management
 * Manages submission verdicts and broadcasts updates across all views
 */
export function SubmissionVerdictProvider({ children }: { children: React.ReactNode }) {
  const [verdicts, setVerdicts] = useState<Map<string, VerdictData>>(new Map());
  const submissionsRef = useRef<Set<string>>(new Set());
  const wsRef = useRef<any>(null);

  // Register submission for tracking
  const registerSubmission = useCallback((submissionId: string) => {
    submissionsRef.current.add(submissionId);
  }, []);

  // Unregister submission
  const unregisterSubmission = useCallback((submissionId: string) => {
    submissionsRef.current.delete(submissionId);
  }, []);

  // Broadcast verdict to all listeners
  const broadcastVerdict = useCallback((verdict: VerdictData) => {
    // Update local state
    setVerdicts((prev) => {
      const updated = new Map(prev);
      updated.set(verdict.submissionId, {
        ...verdict,
        timestamp: new Date().toISOString(),
      });
      return updated;
    });

    // Emit event for all listeners
    window.dispatchEvent(
      new CustomEvent('verdict-update', {
        detail: verdict,
      }),
    );

    // Broadcast to other users via WebSocket if available
    if (wsRef.current?.emit) {
      wsRef.current.emit('verdict-broadcast', verdict);
    }
  }, []);

  // Get verdict for a submission
  const getVerdict = useCallback(
    (submissionId: string) => (verdicts.has(submissionId) ? verdicts.get(submissionId) : undefined),
    [verdicts],
  );

  // Setup WebSocket listener for incoming verdicts
  useEffect(() => {
    const handleIncomingVerdict = (data: VerdictData) => {
      if (submissionsRef.current.has(data.submissionId)) {
        broadcastVerdict(data);
      }
    };

    // Listen for verdict-broadcast events
    const handleBroadcast = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleIncomingVerdict(customEvent.detail);
    };

    window.addEventListener('verdict-broadcast', handleBroadcast);

    return () => {
      window.removeEventListener('verdict-broadcast', handleBroadcast);
    };
  }, [broadcastVerdict]);

  const value: SubmissionVerdictContextType = {
    verdicts,
    registerSubmission,
    unregisterSubmission,
    broadcastVerdict,
    getVerdict,
  };

  return (
    <SubmissionVerdictContext.Provider value={value}>
      {children}
    </SubmissionVerdictContext.Provider>
  );
}

/**
 * useSubmissionVerdict Hook - Access global verdict state
 */
export function useSubmissionVerdict() {
  const context = useContext(SubmissionVerdictContext);

  if (!context) {
    throw new Error(
      'useSubmissionVerdict must be used within SubmissionVerdictProvider',
    );
  }

  return context;
}
