import Link from "next/link";

interface AppSidebarProps {
  activeTab?: "register" | "programme" | "partners" | "checkin" | "attendance";
  isAdmin?: boolean;
}

export function AppSidebar({ activeTab = "register", isAdmin = false }: AppSidebarProps) {
  return (
    <aside className="w-[256px] h-screen bg-white border-r border-[rgba(28,46,90,0.1)] flex flex-col justify-between fixed left-0 top-0 z-40">
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-[16px]">
          {/* OAK Header Section */}
          <div className="p-[24px] border-b border-[rgba(28,46,90,0.1)] h-[130px] flex flex-col justify-center">
            <div className="text-[24px] font-extrabold tracking-widest text-[#162E55] font-serif leading-none">
              OAK
            </div>
            <p className="text-[10px] font-semibold text-[#6B7590] uppercase tracking-[1.2px] mt-[6px]">
              FOUNDATION
            </p>
            <p className="text-[12px] font-semibold text-[#6B7590] uppercase tracking-[1.2px] mt-[12px]">
              PARTNER CONVENING 2026
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-[16px] space-y-[8px]">
            {isAdmin ? (
              <>
                <Link
                  href="/admin/check-in"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "checkin"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">🔍</span> Check In
                </Link>
                <Link
                  href="/admin/programme"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "programme"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">📅</span> Programme
                </Link>
                <Link
                  href="/admin/directory"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "partners"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">🌐</span> Partners
                </Link>
                <Link
                  href="/admin/attendees"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "attendance"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">📊</span> Attendance
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "register"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
                <Link
                  href="/programme"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "programme"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">📅</span> Programme
                </Link>
                <Link
                  href="/partners"
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px] font-semibold text-[14px] transition ${
                    activeTab === "partners"
                      ? "bg-[#162E55] text-white shadow-[0px_4px_20px_rgba(28,46,90,0.3)]"
                      : "text-[#6B7590] hover:bg-[#EEF1F5]"
                  }`}
                >
                  <span className="text-base">🌐</span> Partners
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Location Badge */}
        <div className="p-[20px] border-t border-[rgba(28,46,90,0.1)] flex items-center gap-[10px] h-[73px]">
          <div className="w-[32px] h-[32px] rounded-[12px] bg-[#EEF1F5] flex items-center justify-center">
            <svg className="w-[14px] h-[14px] text-[#A8BBCE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[12px] text-[#0E1726]">Harare, Zimbabwe</p>
            <p className="text-[10px] text-[#6B7590]">9–11 March 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}