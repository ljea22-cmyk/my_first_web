# Context — my-first-web 프로젝트 상태

## 현재 상태


## 기술 결정 사항


---

Ch9 Supabase Auth 추가 지침

- 인증: 이메일/비밀번호만 사용합니다. 소셜 로그인은 다루지 않습니다.
- Supabase Auth 호출은 `signInWithPassword`를 사용합니다. `auth.signIn()` 같은 구버전 호출은 사용하지 않습니다.
- 서비스 역할 키(service_role)는 서버 전용이며 클라이언트에 절대 포함하지 않습니다.
- 환경변수(Ch8 규약) 유지:
	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEY
- 보호 라우트: App Router 환경에서 `middleware.ts`를 사용하여 보호합니다.

Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 `package.json`과 버전 차이가 있을 수 있음(예: 이 저장소는 `@supabase/supabase-js` ^2.105.1, `@supabase/ssr` ^0.10.2 를 명시).
- 문서/수업 예시는 교재 기준으로 통일하되, 빌드 이슈는 `package.json`을 기준으로 디버깅합니다.

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

Ch10 준비 체크

- Supabase 브라우저 클라이언트는 `lib/supabase/client.ts`를 사용합니다. (Ch8 규약)
- 인증 상태 공유는 `AuthProvider` + `useAuth()` 패턴을 사용합니다 (Ch9 규약).
- posts 테이블 컬럼은 마이그레이션 파일(`supabase/migrations/20260504045519_create_tables.sql`)에 맞춰 `user_id` 컬럼명을 사용합니다. 문서/코드에서 `author_id` 같은 다른 이름을 쓰지 마세요.
- App Router만 사용합니다. `pages/` 또는 `next/router` 사용 금지.
- UI에서 편집/삭제 버튼은 제공하되, 실제 권한 검증은 Ch11(RLS)에서 다룹니다.

### Ch10: posts CRUD 구현 상태 요약

- 목록: `app/posts/page.tsx` (Server Component)에서 Supabase로부터
	`.from('posts').select('id, title, content, created_at, user_id').order('created_at', { ascending: false })` 로 로드합니다.
- 상세: `app/posts/[id]/page.tsx` (Server)에서 `.eq('id', params.id).maybeSingle()`로 단일 조회, 누락 시 `notFound()` 호출합니다.
- 작성: `app/posts/new/page.tsx` (Client)에서 `useAuth()`로 현재 사용자 확인 후
	`createBrowserSupabase().from('posts').insert([{ title, content, user_id: user.id }]).select('id').single()` 로 생성합니다.
- 수정/삭제: `components/PostActions.tsx`(Client)에서 작성자인 경우에만 편집/삭제 UI를 표시하며
	`.update(...).eq('id', postId)` / `.delete().eq('id', postId)`를 호출합니다. (UI 분기는 있지만 실제 권한 검증은 Ch11 RLS에서 처리 예정)

### Supabase 쿼리 패턴 (사례)

- select: .from('posts').select('id, title, content, created_at, user_id')
- insert: .from('posts').insert([{ title, content, user_id }]).select('id').single()
- update: .from('posts').update({ title, content }).eq('id', postId)
- delete: .from('posts').delete().eq('id', postId)

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용

버전 정책 (교재 vs 현재 설치)

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준 (package.json): @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2

문서/예시는 교재 기준으로 작성하되, 실제 빌드/런타임 문제는 `package.json`에 기록된 현재 설치 기준을 우선으로 디버깅하세요.