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
- [ ] 로그인/회원가입
- [ ] Supabase Auth 연동 (Ch9 기준)
	- 이메일/비밀번호 인증만 구현
	- `signInWithPassword` 사용
	- service_role 키는 클라이언트에 두지 않음
	- 환경변수 이름: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

Version Policy 참고:
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 repo `package.json`의 버전이 더 최신일 경우 빌드 오류는 `package.json` 기준으로 확인

## 3단계: 고급 기능 (Ch11~12)

- [ ] 마이페이지
- [ ] 댓글 기능

## 진행률: 6/12 (50%)