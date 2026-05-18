-- profiles: auth.users 확장 (닉네임·역할 등 추가 정보)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'counselor')),
  created_at timestamptz default now()
);

-- posts: 블로그 글
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- 기존 계정 profiles에 추가
insert into public.profiles (id, username)
select id, email from auth.users
where id not in (select id from public.profiles);

-- 앞으로 가입하는 계정 자동 추가 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();