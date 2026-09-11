'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminNavProps {
  adminName?: string;
}

const NAV_ITEMS = [
  { label: 'Check In', href: '/admin/check-in', icon: '🔍' },
  { label: 'Programme', href: '/admin/programme', icon: '📅' },
  { label: 'Partners', href: '/admin/directory', icon: '🌐' },
  { label: 'Attendance', href: '/admin/headcount', icon: '📊' },
];

export default function AdminNav({ adminName = "Admin" }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-white border-r border-[#E2E8F0] min-h-screen p-6 flex flex-col justify-between fixed left-0 top-0 z-20">
      <div>
        <div className="mb-8">
          <h1 className="text-xl font-black text-[#111827] tracking-wider">OAK</h1>
          <p className="text-[10px] tracking-widest text-[#64748B] uppercase font-bold">Foundation</p>
          <p className="text-xs font-semibold text-[#1D3557] mt-3">PARTNER CONVENING 2026</p>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1D3557] text-white shadow-md'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
        <p className="font-semibold text-[#1E293B]">Logged in as: <span className="text-[#1D3557] font-bold">{adminName}</span></p>
        <p className="font-medium text-[#1E293B]">Harare, Zimbabwe</p>
        <p className="text-[11px] text-[#64748B]">9–11 Nov 2026</p>
      </div>
    </aside>
  );
}