import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const postSchema = z.object({
  eventDayId: z.string().uuid(),
  title: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1).max(10000),
  coverImagePath: z.string().url().nullable().optional(),
  isPublished: z.boolean(),
});

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      response: NextResponse.json(
        { error: "You must sign in to manage documentation." },
        { status: 401 }
      ),
    };
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminProfile) {
    return {
      supabase,
      response: NextResponse.json(
        { error: "You are not authorized to manage documentation." },
        { status: 403 }
      ),
    };
  }

  return { supabase, response: null };
}

export async function GET() {
  const { supabase, response } = await requireAdmin();

  if (response) {
    return response;
  }

  const { data: posts, error } = await supabase
    .from("documentation_posts")
    .select(
      `
        id,
        event_day_id,
        title,
        body,
        cover_image_path,
        is_published,
        published_at,
        created_at,
        updated_at,
        event_days (
          id,
          label,
          event_date
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load documentation posts:", error);

    return NextResponse.json(
      { error: "Could not load documentation posts." },
      { status: 500 }
    );
  }

  return NextResponse.json({ posts: posts || [] });
}

export async function POST(request: Request) {
  try {
    const { supabase, response } = await requireAdmin();

    if (response) {
      return response;
    }

    const parsed = postSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the documentation post.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const post = parsed.data;

    const { data, error } = await supabase
      .from("documentation_posts")
      .insert({
        event_day_id: post.eventDayId,
        title: post.title,
        body: post.body,
        cover_image_path: post.coverImagePath || null,
        is_published: post.isPublished,
        published_at: post.isPublished ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Could not create documentation post:", error);

      return NextResponse.json(
        { error: "Could not create documentation post." },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) {
    console.error("Documentation POST route failed:", error);

    return NextResponse.json(
      { error: "Invalid documentation request." },
      { status: 400 }
    );
  }
}
