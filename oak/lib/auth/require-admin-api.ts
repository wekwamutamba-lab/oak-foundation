import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminApi() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      user: null,
      adminProfile: null,
      errorResponse: NextResponse.json(
        { error: "Authentication is required." },
        { status: 401 }
      ),
    };
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("admin_profiles")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminProfile) {
    return {
      supabase,
      user,
      adminProfile: null,
      errorResponse: NextResponse.json(
        { error: "Admin access is required." },
        { status: 403 }
      ),
    };
  }

  return {
    supabase,
    user,
    adminProfile,
    errorResponse: null,
  };
}