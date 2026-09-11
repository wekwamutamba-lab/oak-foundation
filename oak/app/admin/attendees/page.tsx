"use client";

import { useEffect, useMemo, useState } from "react";

type Attendee = {
  id: string;
  full_name: string;
  organization_name: string;
  sub_partner_name: string | null;
  role_title: string | null;
  email: string;
  phone: string | null;
  dietary_requirements: string | null;
  accessibility_requirements: string | null;
  travel_requirements: string | null;
  status: "registered" | "cancelled";
  consent_given: boolean;
  consent_at: string | null;
  created_at: string;
};

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAttendees(searchTerm = "") {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const response = await fetch(
        `/api/admin/attendees${params.toString() ? `?${params.toString()}` : ""}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load attendees.");
        return;
      }

      setAttendees(data.attendees || []);
    } catch {
      setError("Could not connect to the attendee service.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAttendees();
  }, []);

  const resultText = useMemo(() => {
    if (isLoading) return "Loading attendees…";
    return `${attendees.length} attendee${attendees.length === 1 ? "" : "s"} found`;
  }, [attendees.length, isLoading]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadAttendees(search);
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Private coordination data
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Attendees
          </h1>

          <p className="mt-2 text-gray-600">
            Registration and accommodation information. Do not share this data
            outside OAK Zimbabwe and the event coordination team.
          </p>
        </div>

        <a
          href="/api/admin/attendees/export"
          className="inline-flex items-center justify-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-800"
        >
          Export CSV
        </a>
      </div>

      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="search" className="sr-only">
          Search attendees
        </label>

        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, organization, or email"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
        />

        <button
          type="submit"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-gray-100"
        >
          Search
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">{resultText}</p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[1150px] w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Attendee</th>
              <th className="px-4 py-3 font-semibold">Organization</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Requirements</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {!isLoading && attendees.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No attendees found.
                </td>
              </tr>
            )}

            {attendees.map((attendee) => (
              <tr key={attendee.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900">
                    {attendee.full_name}
                  </p>

                  {attendee.role_title && (
                    <p className="mt-1 text-gray-600">{attendee.role_title}</p>
                  )}

                  <span
                    className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      attendee.status === "registered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {attendee.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-700">
                  <p>{attendee.organization_name}</p>

                  {attendee.sub_partner_name && (
                    <p className="mt-1 text-xs text-gray-500">
                      Sub-partner: {attendee.sub_partner_name}
                    </p>
                  )}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  <p>{attendee.email}</p>

                  {attendee.phone && (
                    <p className="mt-1 text-gray-600">{attendee.phone}</p>
                  )}
                </td>

                <td className="px-4 py-4 text-gray-700">
                  <p>
                    <span className="font-medium">Dietary:</span>{" "}
                    {attendee.dietary_requirements || "None stated"}
                  </p>

                  <p className="mt-2">
                    <span className="font-medium">Access:</span>{" "}
                    {attendee.accessibility_requirements || "None stated"}
                  </p>

                  <p className="mt-2">
                    <span className="font-medium">Travel:</span>{" "}
                    {attendee.travel_requirements || "None stated"}
                  </p>
                </td>

                <td className="px-4 py-4 text-gray-700">
                  <p>
                    {new Date(attendee.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Consent: {attendee.consent_given ? "Given" : "Not recorded"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}