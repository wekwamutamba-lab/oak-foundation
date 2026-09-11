import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("admin_profiles")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminProfile) {
    redirect("/login?error=not-authorized");
  }

  return {
    user,
    adminProfile,
  };
}