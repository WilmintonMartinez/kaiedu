-- KaiEdu: perfiles de usuario y roles
-- Ejecutar en Supabase → SQL Editor → Run

create type public.user_role as enum (
  'administrador',
  'docente',
  'estudiante',
  'operador',
  'invitado'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.user_role not null default 'invitado',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role;
  assigned_name text;
begin
  assigned_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(new.email, '@', 1)
  );

  begin
    assigned_role := coalesce(
      (new.raw_user_meta_data ->> 'role')::public.user_role,
      'invitado'::public.user_role
    );
  exception
    when others then
      assigned_role := 'invitado'::public.user_role;
  end;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, assigned_name, assigned_role);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Usuarios pueden leer su perfil"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Administradores pueden leer perfiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'administrador'
      and admin_profile.is_active = true
  )
);

create policy "Administradores pueden crear perfiles"
on public.profiles
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'administrador'
      and admin_profile.is_active = true
  )
);

create policy "Administradores pueden actualizar perfiles"
on public.profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'administrador'
      and admin_profile.is_active = true
  )
);

-- Perfiles para usuarios que ya existían antes de esta migración
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
  'administrador'::public.user_role
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- El primer usuario administrador del sistema queda con rol administrador.
-- Usuarios nuevos creados desde el panel llevan el rol elegido en metadata.
