## CLAUDE.md

이 파일은 Claude 관련 안내 및 에이전트 사용 규칙을 기록합니다.

간단 가이드:

- Ch9 Supabase Auth 규칙을 따릅니다: 이메일/비밀번호 인증만 사용, `signInWithPassword` 사용, service_role 키는 절대 클라이언트에 두지 않음.
- App Router 전용: `pages/` 또는 `next/router` 사용 금지.
- 환경변수 이름(Ch8 기준) 유지: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

Version Policy (요약):

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 repo의 `package.json`이 더 최신일 수 있음. 설명은 교재 기준으로 통일하되 빌드 오류는 `package.json` 기준으로 확인.

Ch10 준비 체크

- 브라우저 Supabase 클라이언트: `lib/supabase/client.ts`를 사용하도록 안내하세요.
- 인증 상태 공유: `AuthProvider` + `useAuth()` 패턴을 권장합니다.
- posts 테이블 컬럼명은 마이그레이션에 따라 `user_id`를 사용합니다. 문서/코드에서 컬럼명을 일관되게 유지하세요.

버전 안내

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준: `package.json`에 기재된 버전을 함께 표기하고, 빌드 오류 발생 시 해당 버전으로 문제를 조사하세요.

@AGENTS.md
