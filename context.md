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

Ch11 (RLS) 기준 요약

- RLS 정책은 Supabase 웹 콘솔의 SQL Editor로 즉시 생성하지 않습니다. 프로젝트에는 Supabase CLI 마이그레이션(파일: `supabase/migrations/*.sql`)으로 남겨야 합니다.
- RLS 적용 대상 핵심: `posts` 테이블의 `user_id` 컬럼과 `auth.uid()`를 기준으로 정책을 만듭니다. (예: INSERT/UPDATE/DELETE는 auth.uid() === user_id인 경우만 허용)
- 클라이언트 UI에서의 조건 분기는 UX일 뿐 보안이 아닙니다. 실제 권한 검증은 반드시 RLS가 담당해야 합니다.
- 서비스 역할 키(service_role)는 절대 클라이언트 코드에 포함시키지 않습니다. 클라이언트에는 `NEXT_PUBLIC_*` 접두사 키만 노출됩니다.

Posts 테이블 RLS 적용 현황

- RLS 활성화: `posts` 테이블에 RLS를 활성화했습니다.
- 적용 정책 요약:
	- SELECT: 누구나 읽기 가능
	- INSERT: 로그인 사용자만 가능, inserted `user_id`는 `auth.uid()`와 일치해야 함
	- UPDATE: 작성자만 가능(수정 전후 `user_id`는 `auth.uid()`와 동일)
	- DELETE: 작성자만 가능
- 마이그레이션 파일: `supabase/migrations/20260520043533_add_posts_rls.sql`

검증(예상 결과)

- 비로그인 조회: 성공 (SELECT 공개)
- 비로그인 작성: 실패 (INSERT WITH CHECK 위반)
- 사용자 A가 작성: 성공 (인증된 사용자가 자신의 user_id로 INSERT)
- 사용자 B가 A 글 수정: 실패 (UPDATE USING 조건 불일치)
- 사용자 B가 A 글 삭제: 실패 (DELETE USING 조건 불일치)

테스트 권장 절차

- 로컬/스테이징 DB에 마이그레이션을 적용한 뒤, supabase-js로 A/B 계정 토큰을 사용해 위 시나리오를 확인하세요. (예시 스크립트는 `docs/` 또는 `scripts/`로 추가 가능)

Version note (교재 기준 vs 현재 설치 기준)

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치(이 리포지토리 `package.json`): @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2

다음 단계: RLS를 적용할 테이블(아래 요약)만 확정하고, 실제 SQL 마이그레이션 파일은 별도 이슈에서 생성합니다.
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

---

Ch11 마무리 — 다음 단계

- 마이그레이션 파일을 git에 추가하고 커밋합니다: `supabase/migrations/20260520043533_add_posts_rls.sql`.
- Staging DB에 마이그레이션을 적용하고(예: `npx supabase db push`) 익명/사용자A/사용자B 시나리오를 검증하세요.
- 검증 결과는 `docs/rls-test-results.md` (또는 `docs/`)에 간단히 기록해 두면 좋습니다.