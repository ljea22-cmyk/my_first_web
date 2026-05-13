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

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용