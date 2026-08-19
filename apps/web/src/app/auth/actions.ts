"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string;
};

function missingEnvMessage(): LoginState {
  return {
    error:
      "Supabase no está configurado. En Vercel abre el proyecto kaiedu → Settings → Environment Variables (no solo Shared) y agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Luego Redeploy.",
  };
}

export async function login(
  _prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completa correo y contraseña." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return missingEnvMessage();
  }

  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return missingEnvMessage();
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Correo o contraseña incorrectos. Verifica tus datos." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
