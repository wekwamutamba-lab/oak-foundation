"use client";

import { useCallback, useEffect, useState } from "react";


type HeadcountRow = {
  event_day_id: string;
  event_date: string;
  label: string;
  checked_in_count: number;
};

export default function HeadcountPage() {
  const [headcount, setHeadcount] = useState<HeadcountRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);

  const loadHeadcount = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/headcount", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load headcount.");
        return;
      }

      setHeadcount(data.headcount || []);
      setRefreshedAt(data.refreshedAt || new Date().toISOString());
      setError(null);
    } catch {
      setError("Could not connect to the headcount service.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHeadcount();

    const refreshInterval = window.setInterval(() => {
      void loadHeadcount();
    }, 10_000);

    return () => window.clearInterval(refreshInterval);
  }, [loadHeadcount]);

  const totalCheckedIn = headcount.reduce(
    (total, day) => total + day.checked_in_count,
    0
  );

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Live attendance
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Daily headcount
          </h1>

          <p className="mt-2 text-gray-600">
            Attendance totals refresh automatically every 10 seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadHeadcount()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        >
          Refresh now
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {error}
        </div>
      )}

      <div className="mt-7 rounded-xl bg-gray-900 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-gray-300">
          Total check-ins across all days
        </p>

        <p className="mt-2 text-5xl font-bold">
          {isLoading ? "—" : totalCheckedIn}
        </p>

        <p className="mt-3 text-sm text-gray-300">
          This is a sum of daily attendance records. A person attending on more
          than one day is counted once for each day attended.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {headcount.map((day) => (
          <article
            key={day.event_day_id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-green-700">{day.label}</p>

            <p className="mt-2 text-sm text-gray-600">
              {new Date(`${day.event_date}T12:00:00`).toLocaleDateString(
                undefined,
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <p className="mt-6 text-4xl font-bold text-gray-900">
              {isLoading ? "—" : day.checked_in_count}
            </p>

            <p className="mt-1 text-sm text-gray-500">checked in</p>
          </article>
        ))}
      </div>

      {!isLoading && headcount.length === 0 && !error && (
        <p className="mt-6 text-gray-600">No event days were found.</p>
      )}

      {refreshedAt && (
        <p className="mt-6 text-sm text-gray-500">
          Last refreshed:{" "}
          {new Date(refreshedAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      )}
    </section>
  );
}