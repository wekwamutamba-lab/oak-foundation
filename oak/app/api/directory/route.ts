import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabasePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getSupabasePublicClient();

    const { data: partners, error } = await supabase
      .from("partners")
      .select(
        `
          id,
          name,
          description,
          website_url,
          logo_path,
          is_sub_partner,
          parent_partner_id,
          display_order
        `
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Could not load partner directory:", error);

      return NextResponse.json(
        { error: "Could not load the partner directory." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { partners: partners || [] },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  } catch (error) {
    console.error("Directory API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}