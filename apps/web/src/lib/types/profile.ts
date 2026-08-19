export const USER_ROLES = [
  "administrador",
  "docente",
  "estudiante",
  "operador",
  "invitado",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  administrador: "Administrador",
  docente: "Docente",
  estudiante: "Estudiante",
  operador: "Operador",
  invitado: "Invitado",
};

export type ThemeMode = "light" | "dark";

export const USER_THEME_MODES = ["light", "dark"] as const;

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  theme: ThemeMode;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function canManageUsers(role: UserRole): boolean {
  return role === "administrador";
}
