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

    const { data: eventDays, error } = await supabase
      .from("event_days")
      .select(
        `
          id,
          label,
          event_date,
          programme_sessions (
            id,
            title,
            description,
            location,
            starts_at,
            ends_at,
            speaker_names,
            display_order
          )
        `
      )
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Could not load programme:", error);

      return NextResponse.json(
        { error: "Could not load the event programme." },
        { status: 500 }
      );
    }

    const programme = (eventDays || []).map((eventDay) => ({
      ...eventDay,
      programme_sessions: [...(eventDay.programme_sessions || [])].sort(
        (a, b) => {
          if (a.display_order !== b.display_order) {
            return a.display_order - b.display_order;
          }

          return a.starts_at.localeCompare(b.starts_at);
        }
      ),
    }));

    return NextResponse.json(
      { programme },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  } catch (error) {
    console.error("Programme API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}