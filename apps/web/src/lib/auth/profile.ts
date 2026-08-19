import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/profile";
import { cache } from "react";
import { redirect } from "next/navigation";

export const getCurrentUserProfile = cache(async (): Promise<Profile | null> => {
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

  if (error) {
    console.error("[KaiEdu] Error al leer perfil:", error.message, error.code);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...(data as Profile),
    theme: data.theme === "dark" ? "dark" : "light",
  };
});

export async function requireAuthProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login?error=sin_perfil");
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
