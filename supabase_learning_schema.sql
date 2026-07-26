-- ============================================================
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query -> paste & Run
-- ============================================================

create table if not exists public.learning_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  summary       text,
  content       text,
  cover_image   text,
  category      text,
  tags          text[],
  level         text check (level in ('Pemula','Menengah','Mahir')),
  reading_time  integer default 5,
  views         integer default 0,
  status        text not null default 'draft' check (status in ('draft','published')),
  seo_title     text,
  seo_desc      text,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Index untuk search & filter
create index if not exists idx_learning_status   on public.learning_posts(status);
create index if not exists idx_learning_category on public.learning_posts(category);
create index if not exists idx_learning_slug     on public.learning_posts(slug);

-- Increment views function
create or replace function increment_learning_views(post_id uuid)
returns void language plpgsql as $$
begin
  update public.learning_posts set views = views + 1 where id = post_id;
end;
$$;

-- Disable RLS (portfolio personal — tidak perlu RLS)
alter table public.learning_posts disable row level security;
