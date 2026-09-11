interface AttendeeProps {
  name: string;
  organization: string;
  role: string;
  nextSession: string;
  venue: string;
  checkedInCount: number;
  totalCount: number;
  onScanNext: () => void;
}

export default function CheckInSuccess({
  name = 'Maria Schmidt',
  organization = 'Open Society Foundations',
  role = 'Partner',
  nextSession = 'Opening Plenary',
  venue = 'Main Hall A',
  checkedInCount = 24,
  totalCount = 110,
  onScanNext,
}: AttendeeProps) {
  const percentage = Math.round((checkedInCount / totalCount) * 100);

  return (
    <div className="max-w-[480px] w-full mx-auto space-y-4">
      {/* Green Banner */}
      <div className="bg-[#10B981] text-white rounded-[20px] p-4 flex items-center gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
        <div>
          <h3 className="font-bold text-base">Checked In Successfully</h3>
          <p className="text-xs opacity-90">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Harare</p>
        </div>
      </div>

      {/* Attendee Details Card */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1D3557] text-white font-bold text-lg flex items-center justify-center">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1E293B]">{name}</h2>
            <p className="text-xs text-[#64748B]">{organization}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[11px] font-semibold text-[#1D3557]">
              • {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#E2E8F0]">
          <div className="bg-[#F8FAFC] p-3 rounded-[12px]">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">NEXT SESSION</p>
            <p className="text-xs font-bold text-[#1E293B] mt-1">{nextSession}</p>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-[12px]">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">VENUE</p>
            <p className="text-xs font-bold text-[#1E293B] mt-1">{venue}</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-sm">
        <div className="flex justify-between items-center text-xs font-medium mb-2">
          <span className="text-[#10B981] font-bold">● Opening Plenary starting at 09:30</span>
        </div>
        <p className="text-xs text-[#64748B] mb-2">{checkedInCount} of {totalCount} attendees checked in · {venue}</p>
        <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
          <div className="bg-[#1D3557] h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onScanNext}
        className="w-full bg-[#1D3557] text-white font-semibold py-3.5 rounded-[10px] hover:bg-[#111827] transition shadow-md"
      >
        Scan Next Attendee
      </button>
    </div>
  );
}