# 프로젝트 규칙 (에이전트용)

다음 규칙은 Ch7~Ch9 교육 자료 기준으로 정리된 프로젝트 규칙입니다. 자동화 에이전트는 이 규칙을 우선 준수합니다.

1) 라우터/프로젝트 구조
 - Next.js App Router만 사용합니다. `pages/` 폴더나 `next/router` 사용 금지.

2) 인증 (Ch9 기준)
 - 인증 방식: 이메일/비밀번호만 사용합니다. 소셜 로그인 추가 금지.
 - Supabase Auth 로그인 함수로 `signInWithPassword`를 사용합니다. 구버전 호출 (`auth.signIn`) 금지.
 - 서비스 역할 키(service_role)는 서버 전용입니다. 클라이언트 코드에 절대 포함하지 않습니다.

3) 환경변수
 - Ch8 환경변수 이름을 그대로 유지합니다:
	 - NEXT_PUBLIC_SUPABASE_URL
	 - NEXT_PUBLIC_SUPABASE_ANON_KEY

4) 보호 라우트
 - 보호 라우트는 `middleware.ts`를 사용해 구현합니다 (App Router 패턴).

5) 문서화 및 버전 정책
 - Version Policy:
	 - 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
	 - 실제 `package.json`이 더 최신일 수 있습니다. 문서/수업 예시는 교재 기준으로 통일하되, 빌드/런타임 문제는 `package.json`을 기준으로 원인을 확인합니다.
 - 에이전트는 코드/설명에서 교재 기준을 사용해 예제를 작성하되, 저장소의 `package.json`과 충돌하는 버전 정보는 삭제하지 않고 "교재 기준 vs 현재 설치 기준"으로 함께 명시합니다.

6) 추가 지침
 - `"use client"`는 상호작용 또는 브라우저 API가 필요할 때만 사용합니다.
 - `next/navigation`을 사용해 네비게이션을 수행합니다.

---

파일 변경 시 사람 검토가 필요한 항목은 `TODO`로 남겨두어 자동화가 위험한 변경을 피합니다.
