## CLAUDE.md

이 파일은 Claude 관련 안내 및 에이전트 사용 규칙을 기록합니다.

간단 가이드:

- Ch9 Supabase Auth 규칙을 따릅니다: 이메일/비밀번호 인증만 사용, `signInWithPassword` 사용, service_role 키는 절대 클라이언트에 두지 않음.
- App Router 전용: `pages/` 또는 `next/router` 사용 금지.
- 환경변수 이름(Ch8 기준) 유지: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY


Ch11 RLS guidance

- RLS policy files should be maintained as Supabase CLI migration SQL files under `supabase/migrations/` rather than ad-hoc SQL Editor changes.
- Focus RLS on `posts.user_id` vs `auth.uid()` for INSERT/UPDATE/DELETE restrictions.
- Never expose service_role keys in client code; document and enforce this constraint.

Version note

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치(이 리포지토리 `package.json`): @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2


버전 안내

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준: `package.json`에 기재된 버전을 함께 표기하고, 빌드 오류 발생 시 해당 버전으로 문제를 조사하세요.

@AGENTS.md
