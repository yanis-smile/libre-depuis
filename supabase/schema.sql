-- Libre depuis : une ligne par addiction suivie.
-- Chaque personne ne voit et ne modifie que ses propres lignes (Row Level Security).
-- À coller dans Supabase → SQL Editor, puis « Run ». Peut être relancé sans risque.

create table if not exists public.addictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  type text not null default 'autre'
    check (type in ('tabac', 'alcool', 'cannabis', 'sucre', 'ecrans', 'cafeine', 'jeux', 'autre')),
  since timestamptz not null,
  goals jsonb not null default '[]'::jsonb check (jsonb_typeof(goals) = 'array'),
  best_ms bigint not null default 0 check (best_ms >= 0),
  resets integer not null default 0 check (resets >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addictions_user_id_idx on public.addictions (user_id);

alter table public.addictions enable row level security;

revoke all on public.addictions from anon;
grant select, insert, update, delete on public.addictions to authenticated;

drop policy if exists "Lire ses addictions" on public.addictions;
create policy "Lire ses addictions" on public.addictions
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Ajouter ses addictions" on public.addictions;
create policy "Ajouter ses addictions" on public.addictions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Modifier ses addictions" on public.addictions;
create policy "Modifier ses addictions" on public.addictions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Supprimer ses addictions" on public.addictions;
create policy "Supprimer ses addictions" on public.addictions
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists addictions_set_updated_at on public.addictions;
create trigger addictions_set_updated_at
  before update on public.addictions
  for each row execute function public.set_updated_at();
