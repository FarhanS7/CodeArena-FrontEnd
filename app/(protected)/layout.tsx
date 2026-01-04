"use client";

import { LandingNavbar } from "@/components/layout/MainNavbar";
import { RoleGuard } from "@/features/auth/RoleGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["USER", "ADMIN"]}>
      <LandingNavbar/>
      {children}
    </RoleGuard>
  );
}
