"use client";

import { useEffect, useState } from "react";

type DocumentationPhoto = {
  id: string;
  image_path: string;
  alt_text: string | null;
  display_order: number;
};

type DocumentationPost = {
  id: string;
  title: string;
  body: string;
  cover_image_path: string | null;
  published_at: string | null;
  event_days: {
    id: string;
    label: string;
    event_date: string;
  } | null;
  documentation_photos: DocumentationPhoto[];
};

export default function DocumentationFeed() {
  const [posts, setPosts] = useState<DocumentationPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocumentation() {
      try {
        // This MUST be public. Do not change it to /api/admin/documentation.
        const response = await fetch("/api/documentation");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load event documentation.");
          return;
        }

        setPosts(data.documentation || []);
      } catch {
        setError("Could not connect to the documentation service.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDocumentation();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        Loading event documentation…
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

  if (posts.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        Daily documentation will be published during the gathering.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {post.cover_image_path && (
            <img
              src={post.cover_image_path}
              alt=""
              className="h-56 w-full object-cover sm:h-72"
            />
          )}

          <div className="p-5 sm:p-6">
            <p className="text-sm font-semibold text-green-700">
              {post.event_days?.label || "Event update"}
              {post.event_days?.event_date
                ? ` · ${new Date(
                    `${post.event_days.event_date}T12:00:00`
                  ).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}`
                : ""}
            </p>

            <h3 className="mt-2 text-xl font-bold text-gray-900">
              {post.title}
            </h3>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
              {post.body}
            </p>

            {post.documentation_photos.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {post.documentation_photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.image_path}
                    alt={photo.alt_text || "Event documentation photograph"}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}