import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/profile";
import { redirect } from "next/navigation";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}

export async function requireAuthProfile(): Promise<Profile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile.is_active) {
    redirect("/login?error=cuenta_inactiva");
  }

  return profile;
}

export async function requireAdminProfile(): Promise<Profile> {
  const profile = await requireAuthProfile();

  if (profile.role !== "administrador") {
    redirect("/dashboard");
  }

  return profile;
}
