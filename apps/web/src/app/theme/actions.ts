"use server";

import { createClient } from "@/lib/supabase/server";
import { THEME_COOKIE_KEY, type ThemeMode } from "@/lib/theme/constants";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserTheme(theme: ThemeMode) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para guardar el tema." };
  }

  const { error } = await supabase.rpc("update_own_theme", {
    new_theme: theme,
  });

  if (error) {
    return { error: "No se pudo guardar el tema. Ejecuta 003_profile_theme.sql en Supabase." };
  }

  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_KEY, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/dashboard", "layout");

  return { success: true as const };
}
