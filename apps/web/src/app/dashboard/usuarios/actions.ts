"use server";

import { requireAdminProfile } from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/types/profile";
import { revalidatePath } from "next/cache";

export type UserFormState = {
  error?: string;
  success?: string;
};

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return null;
}

export async function createUser(
  _prevState: UserFormState | null,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdminProfile();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleValue = String(formData.get("role") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Completa nombre, correo y contraseña." };
  }

  if (!isUserRole(roleValue)) {
    return { error: "Selecciona un rol válido." };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: roleValue,
      },
    });

    if (error || !data.user) {
      return {
        error:
          error?.message === "User already registered"
            ? "Ya existe un usuario con ese correo."
            : "No se pudo crear el usuario. Verifica la service role key.",
      };
    }

    const { error: profileError } = await admin.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role: roleValue as UserRole,
      is_active: true,
    });

    if (profileError) {
      return {
        error: "Usuario creado, pero falló el perfil. Revisa la migración SQL.",
      };
    }
  } catch {
    return {
      error:
        "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor. Agrégala en .env.local y Vercel.",
    };
  }

  revalidatePath("/dashboard/usuarios");
  return { success: "Usuario registrado correctamente." };
}

export async function updateUserRole(formData: FormData): Promise<void> {
  await requireAdminProfile();

  const userId = String(formData.get("user_id") ?? "");
  const roleValue = String(formData.get("role") ?? "");

  if (!userId || !isUserRole(roleValue)) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("profiles").update({ role: roleValue }).eq("id", userId);

  revalidatePath("/dashboard/usuarios");
}

export async function toggleUserActive(formData: FormData): Promise<void> {
  const adminProfile = await requireAdminProfile();

  const userId = String(formData.get("user_id") ?? "");
  const isActive = String(formData.get("is_active") ?? "") === "true";

  if (!userId || (userId === adminProfile.id && !isActive)) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);

  revalidatePath("/dashboard/usuarios");
}
