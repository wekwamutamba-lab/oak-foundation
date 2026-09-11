import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

function escapeCsvValue(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);

  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;

  return `"${safeText.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    const { supabase, errorResponse } = await requireAdminApi();

    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter." },
        { status: 400 }
      );
    }

    const { data: attendees, error } = await supabase
      .from("attendees")
      .select(
        "id, event_id, first_name, last_name, email, phone, dietary_requirements, accessibility_requirements, travel_requirements, accommodation, status, qr_token, attendance, created_at, updated_at"
      )
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Attendees export query failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return NextResponse.json(
        { error: "Could not export attendees." },
        { status: 500 }
      );
    }

    const headers = [
      "ID",
      "Event ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Dietary Requirements",
      "Accessibility Requirements",
      "Travel Requirements",
      "Accommodation",
      "Status",
      "QR Token",
      "Attendance",
      "Created At",
      "Updated At",
    ];

    const rows = (attendees || []).map((attendee) => [
      attendee.id,
      attendee.event_id,
      attendee.first_name,
      attendee.last_name,
      attendee.email,
      attendee.phone,
      attendee.dietary_requirements,
      attendee.accessibility_requirements,
      attendee.travel_requirements,
      attendee.accommodation,
      attendee.status,
      attendee.qr_token,
      attendee.attendance,
      attendee.created_at,
      attendee.updated_at,
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="attendees-${eventId}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Attendees export API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}