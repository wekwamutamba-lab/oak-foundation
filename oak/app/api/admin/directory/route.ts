import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  websiteUrl: z.string().trim().url().nullable().optional(),
  logoPath: z.string().trim().url().nullable().optional(),
  isSubPartner: z.boolean().default(false),
  parentPartnerId: z.string().uuid().nullable().optional(),
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
        { error: "You must sign in to manage partners." },
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
        { error: "You are not authorized to manage partners." },
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
        display_order,
        is_published,
        created_at,
        updated_at
      `
    )
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Could not load admin partners:", error);

    return NextResponse.json(
      { error: "Could not load partners." },
      { status: 500 }
    );
  }

  return NextResponse.json({ partners: partners || [] });
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin();

  if (response) {
    return response;
  }

  try {
    const body: unknown = await request.json();
    const parsed = partnerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the partner details.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const partner = parsed.data;

    const { data, error } = await supabase
      .from("partners")
      .insert({
        name: partner.name,
        description: partner.description || null,
        website_url: partner.websiteUrl || null,
        logo_path: partner.logoPath || null,
        is_sub_partner: partner.isSubPartner,
        parent_partner_id: partner.parentPartnerId || null,
        display_order: partner.displayOrder,
        is_published: partner.isPublished,
      })
      .select()
      .single();

    if (error) {
      console.error("Could not create partner:", error);

      return NextResponse.json(
        { error: "Could not create partner." },
        { status: 500 }
      );
    }

    return NextResponse.json({ partner: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid partner request." },
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
    const parsed = partnerSchema.safeParse(body);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { error: "A valid partner ID and details are required." },
        { status: 400 }
      );
    }

    const partner = parsed.data;

    const { data, error } = await supabase
      .from("partners")
      .update({
        name: partner.name,
        description: partner.description || null,
        website_url: partner.websiteUrl || null,
        logo_path: partner.logoPath || null,
        is_sub_partner: partner.isSubPartner,
        parent_partner_id: partner.parentPartnerId || null,
        display_order: partner.displayOrder,
        is_published: partner.isPublished,
      })
      .eq("id", partner.id)
      .select()
      .single();

    if (error) {
      console.error("Could not update partner:", error);

      return NextResponse.json(
        { error: "Could not update partner." },
        { status: 500 }
      );
    }

    return NextResponse.json({ partner: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid partner request." },
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
      { error: "Partner ID is required." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    console.error("Could not delete partner:", error);

    return NextResponse.json(
      { error: "Could not delete partner." },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}