-- Kraftteller: Server-Tabellen (Präfix kt_). Additiv, ändert keine fremden Tabellen.

create table public.kt_state (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.kt_diary (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  day date not null,
  label text not null check (char_length(label) between 1 and 200),
  recipe_id text check (char_length(recipe_id) <= 60),
  portions numeric not null default 1 check (portions > 0 and portions <= 50),
  kcal integer not null check (kcal between 0 and 20000),
  protein integer not null default 0 check (protein between 0 and 2000),
  price numeric not null default 0 check (price >= 0 and price < 1000),
  eaten_at timestamptz not null default now()
);
create index kt_diary_user_day_idx on public.kt_diary (user_id, day);

create table public.kt_weights (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  day date not null,
  kg numeric(5,1) not null check (kg between 20 and 400),
  primary key (user_id, day)
);

create table public.kt_ratings (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  recipe_id text not null check (char_length(recipe_id) between 1 and 60),
  stars smallint not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- Öffentliche Zusammenfassung der Bewertungen, nur per Trigger beschreibbar
create table public.kt_recipe_stats (
  recipe_id text primary key,
  n integer not null default 0,
  total integer not null default 0
);

create function public.kt_rating_stats_sync() returns trigger
language plpgsql security definer set search_path = '' as $$
declare rid text := coalesce(new.recipe_id, old.recipe_id);
begin
  insert into public.kt_recipe_stats (recipe_id, n, total)
    select rid, count(*), coalesce(sum(stars), 0) from public.kt_ratings where recipe_id = rid
  on conflict (recipe_id) do update set n = excluded.n, total = excluded.total;
  return null;
end $$;
revoke all on function public.kt_rating_stats_sync() from public, anon, authenticated;

create trigger kt_ratings_sync after insert or update or delete on public.kt_ratings
  for each row execute function public.kt_rating_stats_sync();

create table public.kt_user_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  author text check (char_length(author) <= 40),
  name text not null check (char_length(name) between 3 and 100),
  cats text[] not null default '{haupt}',
  time_min integer not null check (time_min between 1 and 600),
  ing jsonb not null check (jsonb_typeof(ing) = 'array' and jsonb_array_length(ing) between 1 and 40),
  steps jsonb not null check (jsonb_typeof(steps) = 'array' and jsonb_array_length(steps) between 1 and 30),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
create index kt_user_recipes_user_idx on public.kt_user_recipes (user_id);
create index kt_user_recipes_public_idx on public.kt_user_recipes (created_at desc) where is_public;

alter table public.kt_state enable row level security;
alter table public.kt_diary enable row level security;
alter table public.kt_weights enable row level security;
alter table public.kt_ratings enable row level security;
alter table public.kt_recipe_stats enable row level security;
alter table public.kt_user_recipes enable row level security;

create policy kt_state_own on public.kt_state for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy kt_diary_own on public.kt_diary for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy kt_weights_own on public.kt_weights for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy kt_ratings_own on public.kt_ratings for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy kt_stats_read on public.kt_recipe_stats for select to anon, authenticated using (true);
create policy kt_recipes_read on public.kt_user_recipes for select to anon, authenticated
  using (is_public or user_id = (select auth.uid()));
create policy kt_recipes_insert on public.kt_user_recipes for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy kt_recipes_update on public.kt_user_recipes for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy kt_recipes_delete on public.kt_user_recipes for delete to authenticated
  using (user_id = (select auth.uid()));
