'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * RoleGuard Component - Protects routes based on user roles
 * For now, just checks if user is authenticated via localStorage
 */
export function RoleGuard({ children, allowedRoles = ['USER', 'ADMIN'] }: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Simple auth check - just verify token exists
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
