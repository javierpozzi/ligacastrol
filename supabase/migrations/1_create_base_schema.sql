-- Enable RLS
alter table auth.users enable row level security;

-- Create tables
create table public.users (
  id uuid references auth.users on delete cascade,
  is_admin boolean default false,
  primary key (id)
);

create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo text not null,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.leagues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  year integer not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.league_teams (
  id uuid default gen_random_uuid() primary key,
  league_id uuid references public.leagues on delete cascade,
  team_id uuid references public.teams on delete cascade,
  played integer default 0,
  won integer default 0,
  drawn integer default 0,
  lost integer default 0,
  goals_for integer default 0,
  goals_against integer default 0,
  points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(league_id, team_id)
);

create table public.locations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.matches (
  id uuid default gen_random_uuid() primary key,
  home_team_id uuid references public.teams on delete restrict,
  away_team_id uuid references public.teams on delete restrict,
  league_id uuid references public.leagues on delete cascade,
  location_id uuid references public.locations on delete set null,
  week_number integer not null,
  date timestamp with time zone,
  home_score integer,
  away_score integer,
  status text not null check (status in ('scheduled', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.players (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  team_id uuid references public.teams on delete cascade,
  disabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.match_goals (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches on delete cascade,
  player_id uuid references public.players on delete set null,
  team_id uuid references public.teams on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.teams enable row level security;
alter table public.leagues enable row level security;
alter table public.league_teams enable row level security;
alter table public.locations enable row level security;
alter table public.matches enable row level security;
alter table public.players enable row level security;
alter table public.match_goals enable row level security;

-- Users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

-- Teams policies
create policy "Enable read access for all users" on public.teams
  for select using (true);

create policy "Enable write access for admins" on public.teams
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Leagues policies
create policy "Enable read access for all users" on public.leagues
  for select using (true);

create policy "Enable write access for admins" on public.leagues
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- League Teams policies
create policy "Enable read access for all users" on public.league_teams
  for select using (true);

create policy "Enable write access for admins" on public.league_teams
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Locations policies
create policy "Enable read access for all users" on public.locations
  for select using (true);

create policy "Enable write access for admins" on public.locations
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Matches policies
create policy "Enable read access for all users" on public.matches
  for select using (true);

create policy "Enable write access for admins" on public.matches
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Players policies
create policy "Enable read access for all users" on public.players
  for select using (true);

create policy "Enable write access for admins" on public.players
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Match Goals policies
create policy "Enable read access for all users" on public.match_goals
  for select using (true);

create policy "Enable write access for admins" on public.match_goals
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Create trigger to create user record
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, is_admin)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
