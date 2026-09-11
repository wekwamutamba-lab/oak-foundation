import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const programmeSessionSchema = z.object({
  id: z.string().uuid().optional(),
  eventDayId: z.string().uuid("Choose a valid event day."),
  title: z.string().trim().min(1, "Session title is required.").max(300),
  description: z.string().trim().max(5000).nullable().optional(),
  location: z.string().trim().max(200).nullable().optional(),
  startsAt: z.string().datetime("Enter a valid start date and time."),
  endsAt: z.string().datetime("Enter a valid end date and time.").nullable().optional(),
  speakerNames: z.string().trim().max(1000).nullable().optional(),
  displayOrder: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(false),
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
        { error: "You must sign in to manage programme sessions." },
        { status: 401 }
      ),
    };
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile) {
    return {
      supabase,
      response: NextResponse.json(
        { error: "You are not authorized to manage programme sessions." },
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

  const { data: sessions, error } = await supabase
    .from("programme_sessions")
    .select(
      `
        id,
        event_day_id,
        title,
        description,
        location,
        starts_at,
        ends_at,
        speaker_names,
        display_order,
        is_published,
        event_days (
          id,
          label,
          event_date
        )
      `
    )
    .order("starts_at", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Could not load programme sessions:", error);

    return NextResponse.json(
      { error: "Could not load programme sessions." },
      { status: 500 }
    );
  }

  return NextResponse.json({ sessions: sessions || [] });
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin();

  if (response) {
    return response;
  }

  try {
    const body: unknown = await request.json();
    const parsed = programmeSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the programme session details.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const session = parsed.data;

    if (session.endsAt && new Date(session.endsAt) <= new Date(session.startsAt)) {
      return NextResponse.json(
        { error: "The end time must be after the start time." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("programme_sessions")
      .insert({
        event_day_id: session.eventDayId,
        title: session.title,
        description: session.description || null,
        location: session.location || null,
        starts_at: session.startsAt,
        ends_at: session.endsAt || null,
        speaker_names: session.speakerNames || null,
        display_order: session.displayOrder,
        is_published: session.isPublished,
      })
      .select()
      .single();

    if (error) {
      console.error("Could not create programme session:", error);

      return NextResponse.json(
        { error: "Could not create programme session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid programme request." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const { supabase, response } = await requireAdmin();

  if (response) {
    return response;
  }

  try {
    const body: unknown = await request.json();
    const parsed = programmeSessionSchema.safeParse(body);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { error: "A valid session ID and session details are required." },
        { status: 400 }
      );
    }

    const session = parsed.data;

    if (session.endsAt && new Date(session.endsAt) <= new Date(session.startsAt)) {
      return NextResponse.json(
        { error: "The end time must be after the start time." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("programme_sessions")
      .update({
        event_day_id: session.eventDayId,
        title: session.title,
        description: session.description || null,
        location: session.location || null,
        starts_at: session.startsAt,
        ends_at: session.endsAt || null,
        speaker_names: session.speakerNames || null,
        display_order: session.displayOrder,
        is_published: session.isPublished,
      })
      .eq("id", session.id)
      .select()
      .single();

    if (error) {
      console.error("Could not update programme session:", error);

      return NextResponse.json(
        { error: "Could not update programme session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ session: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid programme request." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { supabase, response } = await requireAdmin();

  if (response) {
    return response;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Programme session ID is required." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("programme_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Could not delete programme session:", error);

    return NextResponse.json(
      { error: "Could not delete programme session." },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}