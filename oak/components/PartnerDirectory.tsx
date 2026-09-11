"use client";

import { useEffect, useState } from "react";

type Partner = {
  id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_path: string | null;
  is_sub_partner: boolean;
  parent_partner_id: string | null;
};

function isSafeWebsiteUrl(value: string | null) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function PartnerDirectory() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPartners() {
      try {
        const response = await fetch("/api/directory");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load the partner directory.");
          return;
        }

        setPartners(data.partners || []);
      } catch {
        setError("Could not connect to the partner directory service.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadPartners();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        Loading partner directory…
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

  if (partners.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-gray-600 shadow-sm">
        Partner information will be available soon.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {partners.map((partner) => {
        const hasWebsite = isSafeWebsiteUrl(partner.website_url);

        return (
          <article
            key={partner.id}
            className="flex min-h-64 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {partner.logo_path ? (
                <img
                  src={partner.logo_path}
                  alt={`${partner.name} logo`}
                  className="h-14 w-14 rounded-lg border border-gray-100 object-contain p-1"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-green-100 text-lg font-bold text-green-800"
                >
                  {partner.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                {partner.is_sub_partner && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Sub-partner
                  </p>
                )}

                <h2 className="text-lg font-semibold text-gray-900">
                  {partner.name}
                </h2>
              </div>
            </div>

            {partner.description && (
              <p className="mt-5 text-sm leading-6 text-gray-600">
                {partner.description}
              </p>
            )}

            <div className="mt-auto pt-5">
              {hasWebsite ? (
                <a
                  href={partner.website_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
                >
                  Visit website <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <p className="text-sm text-gray-400">Website coming soon</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}