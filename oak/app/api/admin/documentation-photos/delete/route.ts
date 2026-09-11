import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must sign in to delete documentation photos." },
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
        { error: "You are not authorized to delete documentation photos." },
        { status: 403 }
      );
    }

    const photoId = new URL(request.url).searchParams.get("id");

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("documentation_photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      console.error("Could not delete documentation photo:", error);

      return NextResponse.json(
        { error: "Could not delete documentation photo." },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Documentation photo delete failed:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}