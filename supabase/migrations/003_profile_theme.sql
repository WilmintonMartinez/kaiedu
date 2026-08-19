-- KaiEdu: preferencia de tema por usuario (light/dark)
-- Ejecutar en Supabase → SQL Editor → Run

do $$
begin
  create type public.user_theme as enum ('light', 'dark');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
add column if not exists theme public.user_theme not null default 'light';

create or replace function public.update_own_theme(new_theme public.user_theme)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set theme = new_theme
  where id = auth.uid();
end;
$$;

revoke all on function public.update_own_theme(public.user_theme) from public;
grant execute on function public.update_own_theme(public.user_theme) to authenticated;
