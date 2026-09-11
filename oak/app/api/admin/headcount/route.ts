import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function GET() {
  try {
    const { supabase, errorResponse } = await requireAdminApi();

    if (errorResponse) {
      return errorResponse;
    }

    const { data: headcount, error } = await supabase
      .from("admin_daily_headcount")
      .select("event_day_id, event_date, label, checked_in_count")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Headcount query failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return NextResponse.json(
        { error: "Could not load headcount." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        headcount: headcount || [],
        refreshedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Headcount API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}