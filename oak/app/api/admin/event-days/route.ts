import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must sign in to view event days." },
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
        { error: "You are not authorized to view event days." },
        { status: 403 }
      );
    }

    const { data: eventDays, error } = await supabase
      .from("event_days")
      .select("id, event_date, label")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Event days API failed:", error);

      return NextResponse.json(
        { error: "Could not load event days." },
        { status: 500 }
      );
    }

    return NextResponse.json({ eventDays });
  } catch (error) {
    console.error("Event days API crashed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}