"use client";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";

interface RoleGuardProps {
  allowedRoles: ("USER" | "ADMIN")[];
  children: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, allowedRoles, redirectTo, router]);

  if (isLoading) return <FullScreenLoader />;

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
