import Link from "next/link";
import ProgrammeList from "@/components/ProgrammeList";
import DocumentationFeed from "@/components/DocumentationFeed";

export default function ProgrammePage() {
  return (
    <div className="py-2 space-y-6">
      {/* Header Section */}
      <div>
        <Link
          href="/admin/check-in"
          className="text-xs font-semibold text-[#1D3557] hover:underline mb-2 inline-block"
        >
          ← Back to check-in
        </Link>

        <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
          OAK Zimbabwe Foundation
        </p>

        <h1 className="text-2xl font-black text-[#1E293B] mt-1">
          Convening Programme
        </h1>

        <p className="text-xs text-[#64748B] mt-1">
          OAK Zimbabwe Partner Gathering · 9–11 November 2026 · Cresta Lodge, Msasa, Harare.
        </p>
      </div>

      {/* Dynamic Programme List Component */}
      <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
        <ProgrammeList />
      </div>

      {/* Daily Documentation Feed Section */}
      <section className="pt-4 border-t border-[#E2E8F0] space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#1E293B]">
            Daily Documentation
          </h2>

          <p className="text-xs text-[#64748B]">
            Curated notes and photographs from the OAK Zimbabwe Partner Gathering.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
          <DocumentationFeed />
        </div>
      </section>
    </div>
  );
}