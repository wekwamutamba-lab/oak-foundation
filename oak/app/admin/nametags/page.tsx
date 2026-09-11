"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Attendee = {
  id: string;
  full_name: string;
  organization_name: string;
  sub_partner_name: string | null;
  role_title: string | null;
  status: "registered" | "cancelled";
  qr_token: string;
};

export default function NametagsPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendees() {
      try {
        const response = await fetch("/api/admin/nametags", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load attendees for nametags.");
          return;
        }

        setAttendees(data.attendees || []);
      } catch {
        setError("Could not connect to the nametag service.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAttendees();
  }, []);

  const filteredAttendees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return attendees;
    }

    return attendees.filter((attendee) => {
      const text = [
        attendee.full_name,
        attendee.organization_name,
        attendee.sub_partner_name || "",
        attendee.role_title || "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [attendees, search]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <section className="mx-auto max-w-7xl">
      <div className="no-print flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Coordination workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Printable nametags
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Print name badges with event QR codes. Private contact and support
            information is not included on nametags.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          disabled={isLoading || filteredAttendees.length === 0}
          className="rounded-md bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Print {filteredAttendees.length} nametag
          {filteredAttendees.length === 1 ? "" : "s"}
        </button>
      </div>

      <div className="no-print mt-6">
        <label htmlFor="search" className="sr-only">
          Search nametags
        </label>

        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, organization, or role"
          className="w-full max-w-lg rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {isLoading && (
        <p className="no-print mt-6 text-gray-600">Loading nametags…</p>
      )}

      {error && (
        <div
          role="alert"
          className="no-print mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {error}
        </div>
      )}

      {!isLoading && !error && filteredAttendees.length === 0 && (
        <p className="no-print mt-6 text-gray-600">
          No registered attendees match your search.
        </p>
      )}

      <div className="nametag-grid mt-8">
        {filteredAttendees.map((attendee) => {
          const passUrl = `${appUrl}/pass?token=${encodeURIComponent(
            attendee.qr_token
          )}`;

          const organization = attendee.sub_partner_name
            ? `${attendee.organization_name} · ${attendee.sub_partner_name}`
            : attendee.organization_name;

          return (
            <article key={attendee.id} className="nametag">
              <div className="nametag-content">
                <div className="nametag-main">
                  <p className="nametag-event">OAK Zimbabwe Foundation</p>

                  <h2 className="nametag-name">{attendee.full_name}</h2>

                  <p className="nametag-organization">{organization}</p>

                  {attendee.role_title && (
                    <p className="nametag-role">{attendee.role_title}</p>
                  )}

                  <div className="nametag-footer">
                    OAK Partner Gathering
                    <br />
                    9–11 November 2026 · Cresta Lodge, Msasa
                  </div>
                </div>

                <div className="nametag-qr">
                  <QRCodeSVG
                    value={passUrl}
                    size={128}
                    level="H"
                    includeMargin
                  />

                  <p>Scan for check-in</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}