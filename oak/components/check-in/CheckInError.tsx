interface ErrorProps {
  onRetry: () => void;
}

export default function CheckInError({ onRetry }: ErrorProps) {
  return (
    <div className="max-w-[480px] w-full mx-auto space-y-4">
      <div className="bg-[#EF4444] text-white rounded-[20px] p-4 flex items-center gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">✕</div>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">CHECK-IN FAILED</p>
          <h3 className="font-bold text-base">QR Not Recognised</h3>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 border border-[#E2E8F0] shadow-sm">
        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Possible Reasons</h4>
        <ul className="space-y-2.5 text-xs text-[#1E293B]">
          <li className="flex items-center gap-2"><span className="text-[#EF4444]">*</span> QR code belongs to a different event</li>
          <li className="flex items-center gap-2"><span className="text-[#EF4444]">*</span> Registration was not completed</li>
          <li className="flex items-center gap-2"><span className="text-[#EF4444]">*</span> Code has been altered or corrupted</li>
          <li className="flex items-center gap-2"><span className="text-[#EF4444]">*</span> Attendee registered under a different email</li>
        </ul>
      </div>

      <div className="space-y-2">
        <button
          onClick={onRetry}
          className="w-full bg-[#1D3557] text-white font-semibold py-3.5 rounded-[10px] hover:bg-[#111827] transition"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}