"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import RegistrationForm from "@/components/RegistrationForm";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensures components using Next router hooks render only after hydration finishes
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Static Sidebar Skeleton during hydration */}
        <aside className="w-[240px] bg-[#0F1C3F] min-h-screen fixed left-0 top-0" />
        <main className="ml-[240px] flex-1 p-10 max-w-[1100px] flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#0F1C3F] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AppSidebar activeTab="register" />

      <main className="ml-[240px] flex-1 p-10 max-w-[1100px]">
        <div className="bg-[#0F1C3F] text-white p-8 rounded-[16px] mb-8 flex justify-between items-center shadow-sm">
          <div>
            <span className="bg-[#1E2D5A] text-xs font-semibold px-3 py-1 rounded-full text-blue-200">
              Harare, Zimbabwe • 9-11 March 2026
            </span>
            <h1 className="text-3xl font-bold mt-3 tracking-tight">
              Partner Convening 2026
            </h1>
          </div>

          <div className="flex gap-8 text-center border-l border-[#1E2D5A] pl-8">
            <div>
              <p className="text-2xl font-bold">110+</p>
              <p className="text-xs text-gray-300">Attendees</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-gray-300">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-bold">38</p>
              <p className="text-xs text-gray-300">Partners</p>
            </div>
          </div>
        </div>

        <RegistrationForm />
      </main>
    </div>
  );
}