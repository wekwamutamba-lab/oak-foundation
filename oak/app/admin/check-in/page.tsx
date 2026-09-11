"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type EventDay = {
  id: string;
  event_date: string;
  label: string;
};

type ScanResult =
  | {
      type: "success";
      fullName: string;
      organizationName: string;
      checkedInAt: string;
      alreadyCheckedIn: boolean;
    }
  | {
      type: "error";
      message: string;
    }
  | null;

function extractQrToken(decodedText: string): string | null {
  try {
    const scannedUrl = new URL(decodedText);
    return scannedUrl.searchParams.get("token");
  } catch {
    const rawValue = decodedText.trim();

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidPattern.test(rawValue) ? rawValue : null;
  }
}

export default function CheckInPage() {
  const scannerId = "oak-qr-reader";

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingScanRef = useRef(false);

  const [eventDays, setEventDays] = useState<EventDay[]>([]);
  const [selectedEventDayId, setSelectedEventDayId] = useState("");
  const [isLoadingDays, setIsLoadingDays] = useState(true);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);

  useEffect(() => {
    async function loadEventDays() {
      try {
        const response = await fetch("/api/admin/event-days", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setResult({
            type: "error",
            message: data.error || "Could not load event days.",
          });
          return;
        }

        const days: EventDay[] = data.eventDays || [];
        setEventDays(days);

        if (days.length > 0) {
          const today = new Date().toISOString().slice(0, 10);
          const todayDay = days.find((day) => day.event_date === today);

          setSelectedEventDayId(todayDay?.id || days[0].id);
        }
      } catch {
        setResult({
          type: "error",
          message: "Could not connect to the event-day service.",
        });
      } finally {
        setIsLoadingDays(false);
      }
    }

    void loadEventDays();
  }, []);

  async function stopCamera() {
    const scanner = scannerRef.current;

    if (!scanner) {
      setIsCameraRunning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }

      await scanner.clear();
    } catch (error) {
      console.error("Could not stop QR scanner:", error);
    } finally {
      scannerRef.current = null;
      setIsCameraRunning(false);
      processingScanRef.current = false;
    }
  }

  async function submitCheckIn(token: string) {
    if (!selectedEventDayId) {
      setResult({
        type: "error",
        message: "Choose an event day before scanning.",
      });
      return;
    }

    const response = await fetch("/api/admin/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qrToken: token,
        eventDayId: selectedEventDayId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setResult({
        type: "error",
        message: data.error || "Check-in failed.",
      });
      return;
    }

    setResult({
      type: "success",
      fullName: data.fullName,
      organizationName: data.organizationName,
      checkedInAt: data.checkedInAt,
      alreadyCheckedIn: data.alreadyCheckedIn,
    });
  }

  async function handleDecodedText(decodedText: string) {
    if (processingScanRef.current) {
      return;
    }

    processingScanRef.current = true;

    const token = extractQrToken(decodedText);

    if (!token) {
      setResult({
        type: "error",
        message: "This QR code is not a valid OAK event pass.",
      });

      processingScanRef.current = false;
      return;
    }

    await submitCheckIn(token);

    window.setTimeout(() => {
      processingScanRef.current = false;
    }, 2500);
  }

  async function startCamera() {
    if (!selectedEventDayId || isStartingCamera || isCameraRunning) {
      return;
    }

    setResult(null);
    setIsStartingCamera(true);

    try {
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => {
          void handleDecodedText(decodedText);
        },
        () => {
          // Scan failures occur continuously while no QR code is in view.
          // They are expected and should not be shown to the user.
        }
      );

      setIsCameraRunning(true);
    } catch (error) {
      console.error("Could not start camera:", error);

      setResult({
        type: "error",
        message:
          "Could not access the camera. Allow camera permission and use HTTPS on a phone.",
      });

      scannerRef.current = null;
    } finally {
      setIsStartingCamera(false);
    }
  }

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  const selectedDay = eventDays.find((day) => day.id === selectedEventDayId);

  return (
    <section className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
        Coordination workspace
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        Attendee QR check-in
      </h1>

      <p className="mt-2 text-gray-600">
        Select the event day, then scan an attendee’s QR pass using this device’s
        camera. Each attendee can be checked in once per day.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="eventDay"
          className="block text-sm font-medium text-gray-800"
        >
          Event day
        </label>

        <select
          id="eventDay"
          value={selectedEventDayId}
          disabled={isLoadingDays || isCameraRunning}
          onChange={(event) => setSelectedEventDayId(event.target.value)}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {isLoadingDays && <option>Loading event days…</option>}

          {!isLoadingDays && eventDays.length === 0 && (
            <option>No event days available</option>
          )}

          {eventDays.map((day) => (
            <option key={day.id} value={day.id}>
              {day.label} —{" "}
              {new Date(`${day.event_date}T12:00:00`).toLocaleDateString(
                undefined,
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </option>
          ))}
        </select>

        {selectedDay && (
          <p className="mt-2 text-sm text-gray-500">
            Scanning attendance for {selectedDay.label}.
          </p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div
          id={scannerId}
          className="overflow-hidden rounded-lg bg-gray-100"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {!isCameraRunning ? (
            <button
              type="button"
              onClick={() => void startCamera()}
              disabled={
                isLoadingDays ||
                !selectedEventDayId ||
                isStartingCamera ||
                eventDays.length === 0
              }
              className="rounded-md bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStartingCamera ? "Opening camera..." : "Start camera scanner"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void stopCamera()}
              className="rounded-md bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700"
            >
              Stop camera
            </button>
          )}
        </div>
      </div>

      {result?.type === "success" && (
        <div
          role="status"
          className={`mt-5 rounded-xl border p-5 ${
            result.alreadyCheckedIn
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-green-200 bg-green-50 text-green-900"
          }`}
        >
          <p className="text-lg font-semibold">
            {result.alreadyCheckedIn
              ? "Already checked in"
              : "Check-in successful"}
          </p>

          <p className="mt-2 font-medium">{result.fullName}</p>

          <p className="mt-1 text-sm">{result.organizationName}</p>

          <p className="mt-3 text-sm">
            {result.alreadyCheckedIn
              ? "This attendee was already recorded for the selected day. No duplicate was added."
              : `Recorded at ${new Date(result.checkedInAt).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}.`}
          </p>
        </div>
      )}

      {result?.type === "error" && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          <p className="font-semibold">Check-in problem</p>
          <p className="mt-2 text-sm">{result.message}</p>
        </div>
      )}
    </section>
  );
}