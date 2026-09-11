import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth/require-admin";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { adminProfile } = await requireAdminPage();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNav adminName={adminProfile.full_name || "Admin"} />
      {/* Offsets main content by the 240px sidebar width */}
      <main className="pl-[240px] p-8 max-w-[1120px] mx-auto">
        {children}
      </main>
    </div>
  );
}