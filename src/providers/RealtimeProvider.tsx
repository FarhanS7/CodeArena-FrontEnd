'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/features/auth/AuthProvider';

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  socket: null,
  isConnected: false,
});

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3005';
    
    // Initialize socket
    const s = io(wsUrl, {
      auth: {
        token: localStorage.getItem('token'), // Assuming token is in localStorage
      },
      transports: ['websocket'],
    });

    s.on('connect', () => {
      console.log('Connected to Realtime Service');
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      console.log('Disconnected from Realtime Service');
      setIsConnected(false);
    });

    s.on('submission-update', (data) => {
      console.log('Submission update received:', data);
      window.dispatchEvent(new CustomEvent('verdict-update', { detail: data }));
    });

    s.on('notification', (data) => {
      console.log('Notification received:', data);
      window.dispatchEvent(new CustomEvent('notification-received', { detail: data }));
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated, user]);

  return (
    <RealtimeContext.Provider value={{ socket, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
