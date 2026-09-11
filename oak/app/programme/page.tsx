import Link from "next/link";
import ProgrammeList from "@/components/ProgrammeList";
import DocumentationFeed from "@/components/DocumentationFeed";

export default function ProgrammePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to event home
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-green-700">
          OAK Zimbabwe Foundation
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Event programme
        </h1>

        <p className="mt-2 text-gray-600">
          OAK Zimbabwe Partner Gathering · 9–11 November 2026 · Cresta Lodge,
          Msasa, Harare.
        </p>

        <div className="mt-8">
          <ProgrammeList />
        </div>

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Daily documentation
          </h2>

          <p className="mt-2 text-gray-600">
            Curated notes and photographs from the OAK Zimbabwe Partner
            Gathering.
          </p>

          <div className="mt-6">
            <DocumentationFeed />
          </div>
        </section>
      </section>
    </main>
  );
}