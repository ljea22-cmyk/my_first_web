## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

- Primary color: shadcn/ui --primary
- Background: --background
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Safety / Naming Rules (important)

- Do NOT rename `posts` table columns from the Ch8 schema. Use `id`, `user_id`, `title`, `content`, `created_at` across code and docs.
- Do NOT use `next/router` or Pages Router patterns; App Router only — use `next/navigation` in client code.
- Do NOT include `service_role` or any server-only Supabase keys in client code. Only `NEXT_PUBLIC_*` keys may be present on the client.

RLS / Ch11 guidance

- Row Level Security (RLS) is authoritative: UI checks are UX only. Always implement RLS policies via a migration under `supabase/migrations/` and commit them.
- Never expose `service_role` or server-only keys in the repo or client bundles. If a server operation needs elevated privileges, run it on the server (API route or server actions) and keep keys in environment variables not checked into source.

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

---

Ch9 Supabase Auth 기준 요약

- 인증 방식: 이메일/비밀번호 인증만 사용. 소셜 로그인을 추가하지 않음.
- Supabase Auth 로그인 구현 시 `signInWithPassword` 사용 (구버전 `auth.signIn()` 사용 금지).
- 서비스 역할 키(service_role)는 클라이언트에 절대 두지 말 것.
- App Router만 사용. `next/router` 또는 `pages/` 라우터 사용 금지.
- 보호 라우트는 교재 기준으로 `middleware.ts`를 사용.
- 환경변수 이름(Ch8 기준) 유지:
	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY

Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 `package.json`이 더 최신일 수 있음. 수업 프롬프트/문서 설명은 위 교재 기준으로 통일.
- 빌드 오류가 버전 차이에서 발생하면 `package.json` 기준으로 원인을 확인.

현재 저장소의 `package.json`(요약):
- @supabase/supabase-js: ^2.105.1 (현재 설치 기준)
- @supabase/ssr: ^0.10.2 (현재 설치 기준)

따라서 코드/설명은 교재 기준으로 작성하되, 실제 빌드/런중 문제가 발생하면 위 실제 설치 기준을 우선 확인하세요.

Ch10 준비 요약

- Ch8에서 생성한 Supabase 브라우저 클라이언트는 `lib/supabase/client.ts`를 사용합니다. 이 파일을 프로젝트의 브라우저/클라이언트 컴포넌트에서 사용하세요 — `createBrowserSupabase()` 또는 `supabase` 싱글톤을 참고합니다.
- Ch9 인증은 `AuthProvider` + `useAuth()` 패턴을 따릅니다. `contexts/AuthContext.tsx` 또는 `components/AuthProvider.tsx` 형태로 구현되어야 합니다.
- posts 테이블 컬럼은 Ch8 마이그레이션(프로젝트 내 `supabase/migrations/*.sql`)에 맞춥니다. 현재 레포의 스키마는 `posts(id, user_id, title, content, created_at)` 입니다. 문서/코드에서 컬럼명(특히 `user_id`)을 Ch8 스키마와 동일하게 사용하세요.
- 라우팅: App Router 전용입니다 (`app/`), `pages/` 또는 `next/router` 사용 금지. 클라이언트 네비게이션은 `next/navigation`을 사용합니다.
- 수정/삭제 UI는 사용자 경험(UX) 영역입니다. 실제 권한 검증/보안은 Ch11에서 RLS로 처리하므로 문서에 UX와 보안 책임을 분리해서 기재합니다.