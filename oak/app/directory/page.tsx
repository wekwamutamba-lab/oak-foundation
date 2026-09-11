import Link from "next/link";
import PartnerDirectory from "@/components/PartnerDirectory";

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-5xl">
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
          Partner directory
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Explore the organizations and sub-partners participating in the OAK
          Zimbabwe Partner Gathering.
        </p>

        <div className="mt-8">
          <PartnerDirectory />
        </div>
      </section>
    </main>
  );
}