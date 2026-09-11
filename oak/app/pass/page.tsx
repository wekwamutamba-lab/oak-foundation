"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

function PassContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const qrValue = useMemo(() => {
    if (!token) return "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return `${appUrl}/pass?token=${encodeURIComponent(token)}`;
  }, [token]);

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <section className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid event pass
          </h1>

          <p className="mt-3 text-gray-600">
            This page does not contain a valid event pass token.
          </p>

          <Link
            href="/register"
            className="mt-6 inline-block rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
          >
            Go to registration
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          OAK Zimbabwe Foundation
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Your Event Pass
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Show this QR code to the coordination team when you arrive each day.
        </p>

        <div className="mt-7 inline-flex rounded-xl border border-gray-200 bg-white p-4">
          <QRCodeSVG
            value={qrValue}
            size={240}
            level="H"
            includeMargin
          />
        </div>

        <p className="mt-5 text-sm font-medium text-gray-800">
          OAK Zimbabwe Partner Gathering
        </p>

        <p className="mt-1 text-sm text-gray-600">
          9–11 November 2026
          <br />
          Cresta Lodge, Msasa, Harare
        </p>

        <div className="mt-7 rounded-lg bg-green-50 p-4 text-left">
          <p className="text-sm font-medium text-green-900">
            Keep this pass safe
          </p>

          <p className="mt-1 text-sm leading-5 text-green-800">
            Bookmark this page or take a screenshot so that you can show the QR
            code at check-in.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
        >
          Return to event home
        </Link>
      </section>
    </main>
  );
}

export default function PassPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow-sm">
            Loading your event pass...
          </div>
        </main>
      }
    >
      <PassContent />
    </Suspense>
  );
}