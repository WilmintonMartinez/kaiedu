-- Corrige recursión infinita en políticas RLS de profiles
-- Ejecutar en Supabase → SQL Editor → Run

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'administrador'
      and is_active = true
  );
$$;

drop policy if exists "Administradores pueden leer perfiles" on public.profiles;
create policy "Administradores pueden leer perfiles"
on public.profiles
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "Administradores pueden crear perfiles" on public.profiles;
create policy "Administradores pueden crear perfiles"
on public.profiles
for insert
to authenticated
with check (public.is_active_admin());

drop policy if exists "Administradores pueden actualizar perfiles" on public.profiles;
create policy "Administradores pueden actualizar perfiles"
on public.profiles
for update
to authenticated
using (public.is_active_admin());
