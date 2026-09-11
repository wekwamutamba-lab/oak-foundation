import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getPublicSupabaseClient() {
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
    const supabase = getPublicSupabaseClient();

    const { data: posts, error } = await supabase
      .from("documentation_posts")
      .select(
        `
          id,
          event_day_id,
          title,
          body,
          cover_image_path,
          published_at,
          event_days (
            id,
            label,
            event_date
          ),
          documentation_photos (
            id,
            image_path,
            alt_text,
            display_order
          )
        `
      )
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Could not load public documentation:", error);

      return NextResponse.json(
        { error: "Could not load event documentation." },
        { status: 500 }
      );
    }

    const documentation = (posts || []).map((post) => ({
      ...post,
      documentation_photos: [...(post.documentation_photos || [])].sort(
        (first, second) => first.display_order - second.display_order
      ),
    }));

    return NextResponse.json({ documentation });
  } catch (error) {
    console.error("Public documentation API failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}