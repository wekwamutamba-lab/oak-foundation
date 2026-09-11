"use client";

import { FormEvent, useEffect, useState } from "react";

type EventDay = {
  id: string;
  label: string;
  event_date: string;
};

type DocumentationPost = {
  id: string;
  event_day_id: string;
  title: string;
  body: string;
  cover_image_path: string | null;
  is_published: boolean;
  event_days: EventDay | null;
};

export default function AdminDocumentationPage() {
  const [eventDays, setEventDays] = useState<EventDay[]>([]);
  const [posts, setPosts] = useState<DocumentationPost[]>([]);
  const [eventDayId, setEventDayId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);

    try {
      const [postsResponse, daysResponse] = await Promise.all([
        fetch("/api/admin/documentation", { cache: "no-store" }),
        fetch("/api/admin/event-days", { cache: "no-store" }),
      ]);

      const postsData = await postsResponse.json();
      const daysData = await daysResponse.json();

      if (!postsResponse.ok) {
        throw new Error(postsData.error || "Could not load documentation.");
      }

      if (!daysResponse.ok) {
        throw new Error(daysData.error || "Could not load event days.");
      }

      const days: EventDay[] = daysData.eventDays || [];

      setPosts(postsData.posts || []);
      setEventDays(days);
      setEventDayId((current) => current || days[0]?.id || "");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load documentation."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/documentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventDayId,
          title,
          body,
          coverImagePath: null,
          isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create documentation post.");
      }

      setMessage("Documentation post created successfully.");
      setTitle("");
      setBody("");
      setIsPublished(false);

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create documentation post."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
        Coordination workspace
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        Daily documentation
      </h1>

      <p className="mt-2 text-gray-600">
        Create daily event updates and choose when they become public.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-800">
          Event day
          <select
            required
            value={eventDayId}
            onChange={(event) => setEventDayId(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {eventDays.map((day) => (
              <option key={day.id} value={day.id}>
                {day.label} — {day.event_date}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block text-sm font-medium text-gray-800">
          Post title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mt-5 block text-sm font-medium text-gray-800">
          Daily notes
          <textarea
            required
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mt-5 flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="h-4 w-4 accent-green-700"
          />
          Publish this update on the public programme page
        </label>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="mt-6 rounded-md bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Create documentation post"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">
          Existing updates
        </h2>

        {isLoading ? (
          <p className="mt-4 text-gray-600">Loading updates…</p>
        ) : posts.length === 0 ? (
          <p className="mt-4 text-gray-600">No updates have been created yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      post.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {post.event_days?.label || "Unknown event day"}
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                  {post.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}