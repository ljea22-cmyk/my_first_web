# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 작성

## 2단계: 핵심 기능 (Ch9~10)

- [x] 포스트 목록 페이지
- [ ] 포스트 상세 페이지
- [ ] 포스트 작성 (CRUD)
	- 상태: 목록/상세/작성은 Ch10에서 기본 구현됨 (`app/posts/page.tsx`, `app/posts/[id]/page.tsx`, `app/posts/new/page.tsx`).
	- 남은 작업: 수정/삭제의 서버측 이전(권장), 그리고 API route로의 이전 여부 결정.
- [ ] 로그인/회원가입
- [ ] Supabase Auth 연동 (Ch9 기준)
	- 이메일/비밀번호 인증만 구현
	- `signInWithPassword` 사용
	- service_role 키는 클라이언트에 두지 않음
	- 환경변수 이름: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

Ch10 준비: posts CRUD 우선 작업 항목

- [ ] Supabase 브라우저 클라이언트 점검: `lib/supabase/client.ts`가 브라우저 전용으로 올바르게 구현되었는지 확인
- [ ] AuthProvider/useAuth 확인: `contexts/AuthContext.tsx` 또는 `components/AuthProvider.tsx`가 app/layout.tsx에 연결되어 있는지 확인
- [ ] posts 마이그레이션 확인: `supabase/migrations/*.sql`에서 posts 테이블의 컬럼명이 `user_id` 인지 확인(현재는 `user_id`로 되어 있음)
- [ ] CRUD 엔드포인트 또는 클라이언트 구현 방안 결정: API routes(`app/api/posts/route.ts`) vs 클라이언트에서 Supabase 직접 호출 (권장: 서버에서 민감한 로직은 서버측에서 처리)
- [ ] 보호 라우트: `/posts/new` 등 작성/수정/삭제 페이지 접근은 `middleware.ts`로 보호 (Ch9 지침)

Ch10 완료 시점에 생성/수정된 파일(참고):
- `app/posts/page.tsx` (Server) — posts 목록 Supabase 조회
- `app/posts/[id]/page.tsx` (Server) — 단일 post 조회 + `PostActions` 마운트
- `app/posts/new/page.tsx` (Client) — 새 글 작성 폼 (useAuth 사용)
- `components/PostActions.tsx` (Client) — 편집/삭제 UI 및 Supabase update/delete 호출
- `contexts/AuthContext.tsx`, `providers/AuthProviderWrapper.tsx` — 클라이언트 인증 컨텍스트/래퍼
- `lib/posts.ts` — Ch8 스키마에 맞춘 로컬 mock 타입/데이터 정리

Version Policy 참고:
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 repo `package.json`의 버전이 더 최신일 경우 빌드 오류는 `package.json` 기준으로 확인

## 3단계: 고급 기능 (Ch11~12)

- [ ] 마이페이지
- [ ] 댓글 기능

Ch11 RLS 마무리 작업

- [x] posts RLS 마이그레이션 파일 생성 (`supabase/migrations/20260520043533_add_posts_rls.sql`)
- [ ] DB에 마이그레이션 적용 (`npx supabase db push` 또는 마이그레이션 실행)
- [ ] 다른 계정(사용자 A/B) 우회 테스트 및 결과 기록
- [ ] 민감 키 노출(grep: sb_secret_, service_role, sbp_) 재검증
- [ ] 빌드/배포 검증 (npm run build, CI 배포 검증)

참고: 마이그레이션 파일은 현재 로컬에 존재합니다. 커밋 후 Staging DB에 적용하여 테스트를 진행해 주세요.

## 진행률: 6/12 (50%)