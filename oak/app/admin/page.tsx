import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/require-admin";

const cards = [
  {
    href: "/admin/check-in",
    title: "QR check-in",
    description: "Scan attendee passes and record daily attendance.",
  },
  {
    href: "/admin/attendees",
    title: "Attendees",
    description: "Search registrations and export accommodation data.",
  },
  {
    href: "/admin/headcount",
    title: "Live headcount",
    description: "View attendance totals for each event day.",
  },
  {
    href: "/admin/programme",
    title: "Programme",
    description: "Manage public programme sessions and documentation.",
  },
  {
    href: "/admin/directory",
    title: "Partner directory",
    description: "Manage partner and sub-partner information.",
  },
];

export default async function AdminDashboardPage() {
  const { adminProfile } = await requireAdminPage();

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
        Coordination workspace
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        Welcome, {adminProfile.full_name || "Admin"}
      </h1>

      <p className="mt-2 max-w-2xl text-gray-600">
        Manage registrations, attendance, event information, and partner
        records for the OAK Zimbabwe Partner Gathering.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {card.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}