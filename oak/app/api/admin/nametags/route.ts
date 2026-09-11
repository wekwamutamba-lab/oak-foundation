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
        { error: "You must sign in to print nametags." },
        { status: 401 }
      );
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminProfile) {
      return NextResponse.json(
        { error: "You are not authorized to print nametags." },
        { status: 403 }
      );
    }

    const { data: attendees, error } = await supabase
      .from("attendees")
      .select(
        `
          id,
          full_name,
          organization_name,
          sub_partner_name,
          role_title,
          status,
          qr_token
        `
      )
      .eq("status", "registered")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Could not load nametag attendees:", error);

      return NextResponse.json(
        { error: "Could not load attendees for nametags." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { attendees: attendees || [] },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Nametags API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}