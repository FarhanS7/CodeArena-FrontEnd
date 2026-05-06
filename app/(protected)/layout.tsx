"use client";

import { LandingNavbar } from "@/components/layout/MainNavbar";
import { RoleGuard } from "@/features/auth/RoleGuard";
import { ProblemAdminAuthProvider } from "@/features/problemAdmin/ProblemAdminAuthProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["USER", "ADMIN"]}>
      <ProblemAdminAuthProvider>
        <LandingNavbar/>
        {children}
      </ProblemAdminAuthProvider>
    </RoleGuard>
  );
}
