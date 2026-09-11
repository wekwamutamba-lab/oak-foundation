import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const checkInSchema = z.object({
  qrToken: z.string().uuid("The QR code is invalid."),
  eventDayId: z.string().uuid("Choose a valid event day."),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must sign in to check in attendees." },
        { status: 401 }
      );
    }

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminProfile) {
      return NextResponse.json(
        { error: "You are not authorized to check in attendees." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    const parsed = checkInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid check-in request.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { qrToken, eventDayId } = parsed.data;

    const { data: result, error } = await supabase.rpc("check_in_attendee", {
      p_qr_token: qrToken,
      p_event_day_id: eventDayId,
    });

    if (error) {
      console.error("Check-in RPC failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      if (error.message.toLowerCase().includes("unauthorized")) {
        return NextResponse.json(
          { error: "You are not authorized to check in attendees." },
          { status: 403 }
        );
      }

      if (error.message.toLowerCase().includes("invalid attendee")) {
        return NextResponse.json(
          { error: "This pass is invalid for the selected event day." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "The attendee could not be checked in." },
        { status:500 }
      );
    }

    const checkIn = result?.[0];

    if (!checkIn) {
      return NextResponse.json(
        { error: "The attendee could not be checked in." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      attendeeId: checkIn.attendee_id,
      fullName: checkIn.full_name,
      organizationName: checkIn.organization_name,
      checkedInAt: checkIn.checked_in_at,
      alreadyCheckedIn: checkIn.already_checked_in,
    });
  } catch (error) {
    console.error("Check-in API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error during check-in." },
      { status: 500 }
    );
  }
}