"use client";

import { useEffect, useState } from "react";

type ProgrammeSession = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  speaker_names: string | null;
  display_order: number;
};

type ProgrammeDay = {
  id: string;
  label: string;
  event_date: string;
  programme_sessions: ProgrammeSession[];
};

function formatTime(dateTime: string) {
  return new Date(dateTime).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEventDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function ProgrammeList() {
  const [programme, setProgramme] = useState<ProgrammeDay[]>([]);
  const [activeDayId, setActiveDayId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgramme() {
      try {
        const response = await fetch("/api/programme");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load the programme.");
          return;
        }

        const days: ProgrammeDay[] = data.programme || [];
        setProgramme(days);

        if (days.length > 0) {
          setActiveDayId(days[0].id);
        }
      } catch {
        setError("Could not connect to the programme service.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProgramme();
  }, []);

  const activeDay = programme.find((day) => day.id === activeDayId);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        Loading programme…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
      >
        {error}
      </div>
    );
  }

  if (programme.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        The event programme will be available soon.
      </div>
    );
  }

  return (
    <section>
      <div
        className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-3"
        role="tablist"
        aria-label="Programme days"
      >
        {programme.map((day) => {
          const isActive = day.id === activeDayId;

          return (
            <button
              key={day.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDayId(day.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-700 hover:bg-green-50"
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {activeDay && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeDay.label}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {formatEventDate(activeDay.event_date)}
          </p>

          {activeDay.programme_sessions.length === 0 ? (
            <div className="mt-5 rounded-xl bg-white p-6 text-gray-600 shadow-sm">
              Sessions for this day will be published soon.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {activeDay.programme_sessions.map((session) => (
                <article
                  key={session.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.title}
                      </h3>

                      {session.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {session.description}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-green-700">
                      {formatTime(session.starts_at)}
                      {session.ends_at ? ` – ${formatTime(session.ends_at)}` : ""}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    {session.location && (
                      <p>
                        <span className="font-medium text-gray-800">
                          Location:
                        </span>{" "}
                        {session.location}
                      </p>
                    )}

                    {session.speaker_names && (
                      <p>
                        <span className="font-medium text-gray-800">
                          With:
                        </span>{" "}
                        {session.speaker_names}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}