## 개요

이 문서는 Next.js App Router 기반 개인 블로그 프로젝트의 아키텍처 뼈대를 정리합니다. 초기 단계에서는 프로젝트 목표와 페이지 구조, 주요 유저 플로우만 포함하며, 컴포넌트 구조와 데이터 모델은 추후 shadcn/ui 설치 및 Ch8 작업 이후에 추가합니다.

---

### 체크리스트
- [x] 프로젝트 목표 정리
- [x] 페이지 맵 (URL 구조 포함)
- [x] 유저 플로우 (글 읽기, 글 작성, 마이페이지)
- [x] 컴포넌트 구조 — shadcn/ui 기준으로 정리됨
- [x] 데이터 모델 — users/posts 기본 스키마 정리됨

## 1) 프로젝트 목표

- 개인 기술 블로그: 글 작성·공유, 포스트 탐색, 간단한 마이페이지를 제공
- 깔끔하고 미니멀한 UI: shadcn/ui 기반 컴포넌트로 일관된 디자인 적용
- 빠른 개발 경험: Next.js App Router(Server Components 우선)와 작은 클라이언트 컴포넌트 컴포지션
- 확장성: 나중에 인증/저장소(DB) 연동 및 마이페이지 기능 확장 용이

## 2) 페이지 맵 (Next.js App Router 기준)

루트 폴더: `app/`

- `/` — 홈
	- 파일: `app/page.tsx`
	- 기능: 최근 포스트 하이라이트, 네비게이션

- `/posts` — 포스트 목록
	- 파일: `app/posts/page.tsx` (Server Component)
	- 기능: 서버에서 초기 포스트 목록을 로드하고, 클라이언트 컴포넌트(`PostsClient`)가 검색/삭제/필터를 처리

- `/posts/new` — 새 포스트 작성
	- 파일: `app/posts/new/page.tsx` (Client Component)
	- 기능: 제목/내용 입력 폼, 제출 후 `/posts`로 리다이렉트

- `/posts/[id]` — 포스트 상세
	- 파일: `app/posts/[id]/page.tsx` (Server Component)
	- 기능: 개별 포스트 렌더링, 댓글(향후), 공유 버튼

- `/me` (또는 `/profile`) — 마이페이지
	- 파일: `app/me/page.tsx` (Server/Client 혼용 가능)
	- 기능: 사용자가 작성한 포스트, 프로필 편집(향후)

- API 라우트 (향후)
	- 예: `app/api/posts/route.ts` — CRUD 엔드포인트
	- 예: `app/api/auth/route.ts` — 인증 관련 라우트 (향후)

## 3) 유저 플로우

아래 플로우는 UI 상호작용과 서버/클라이언트 책임을 함께 기술합니다.

### A. 글 읽기 (브라우징)

- 사용자 동작
	1. 사용자가 `/posts` 또는 홈에서 포스트 카드 목록을 봄
	2. 관심 있는 카드 클릭 → `/posts/[id]`로 이동

- 시스템 책임
	- `app/posts/page.tsx`가 서버에서 초기 목록을 fetch 후 렌더링 (서버 컴포넌트)
	- 카드 클릭 시 라우트 전환, `app/posts/[id]/page.tsx`가 개별 포스트를 서버에서 가져와 SSR 렌더링

- 성공 기준
	- 포스트 내용이 빠르게 표시되고 메타(작성자/날짜)가 노출됨

- 에러/엣지케이스
	- 포스트 없음: 404 UI (친절한 메시지와 목록으로 돌아가기 링크)
	- 네트워크 실패: 간단한 재시도 버튼 혹은 로컬 fallback 데이터 사용

### B. 글 작성

- 사용자 동작
	1. `/posts/new`로 이동(또는 상단 '새 글 작성' 클릭)
	2. 제목과 내용을 입력
	3. '저장' 클릭 → 제출

- 시스템 책임
	- `app/posts/new/page.tsx`는 클라이언트 폼 컴포넌트를 사용
	- 클라이언트에서 간단한 유효성 검사 (제목 필수 등)
	- 제출 시 서버 API (`app/api/posts/route.ts`)에 POST 요청
	- 성공 시 `/posts`로 리다이렉트, 실패 시 에러 토스트 표시

- 입력/출력 계약(간단)
	- Input: { title: string (required), content: string }
	- Output 성공: 201 + created post id
	- Error: 4xx / 5xx 메시지

- 엣지케이스
	- 빈 제목 제출: 프론트에서 차단 및 폼 에러 표시
	- 네트워크 지연: 제출 중 로딩 상태/버튼 비활성화
	- 중복 제출: 버튼 비활성화 혹은 idempotency 처리

### C. 마이페이지 (내 글 관리)

- 사용자 동작
	1. 로그인 후 `/me`로 이동
	2. 내가 쓴 글 리스트 확인, 글 편집/삭제 선택

- 시스템 책임
	- 서버에서 사용자 식별(향후 인증), 해당 사용자의 포스트를 조회
	- 편집/삭제는 클라이언트에서 요청을 보내고, 성공 시 UI 갱신(옵티미스틱 또는 재요청)

- 엣지케이스
	- 권한 없는 접근: 로그인/권한 요청 페이지로 리디렉트
	- 동시성: 삭제/수정 시 최신 상태 검증

## 4) 컴포넌트 구조 (shadcn/ui 기준)

이 프로젝트는 `shadcn/ui`로 기본 컴포넌트를 설치한 상태를 전제로 합니다. 다음은 권장 폴더 구조와 각 컴포넌트의 역할 및 위치입니다.

- 디렉터리
  - `components/ui/` — shadcn/ui 기반의 재사용 가능한 UI 컴포넌트(프로젝트 전역)
  - `components/` — 페이지별 조합 컴포넌트(예: `PostCard`, `PostList`, `EditorForm`)

- 핵심 컴포넌트(설계)
  - Button
    - 위치: `components/ui/button.tsx`
    - 역할: 공통 버튼 스타일과 variant(size/variant) 제공. `class-variance-authority`로 variant 관리.
    - 사용처: 모든 액션 버튼 (글 작성, 저장, 취소, 삭제 등)
  - Card
    - 위치: `components/ui/card.tsx`
    - 역할: 포스트 요약 카드(타이틀, 요약, 메타) 레이아웃 제공.
    - 사용처: `/posts` 목록, 마이페이지의 글 리스트
  - Input
    - 위치: `components/ui/input.tsx`
    - 역할: 텍스트 입력(검색, 제목 입력 등) 일관된 스타일 제공
    - 사용처: 검색바, 폼 필드
  - Dialog
    - 위치: `components/ui/dialog.tsx`
    - 역할: 확인/경고/편집 모달. 접근성(포커스 트랩, aria) 보장
    - 사용처: 삭제 확인, 간단한 편집/미리보기

- 페이지별 조합 컴포넌트
  - `components/PostCard.tsx` — `Card`를 래핑하여 포스트 요약 데이터 바인딩 및 액션(읽기, 삭제) 제공
  - `components/PostList.tsx` — 그리드/리스트 레이아웃 담당, 페이징/로딩 상태 처리
  - `components/EditorForm.tsx` — `Input`, `textarea`, `Button` 조합으로 글 작성/편집 폼 제공

- 설계 원칙
  - Server vs Client: 데이터 패칭과 SEO가 필요한 컴포넌트는 Server Component로, 상호작용이 필요한 부분만 Client Component로 분리
  - Composition: 작은 UI primitives(Button/Input/Card/Dialog)을 조합해 페이지 컴포넌트를 구성
  - 접근성: 모든 폼 필드에 label/aria 속성, Dialog는 포커스 트랩을 적용
  - 문서화: 각 `components/ui/*`에 간단한 사용 예시와 props 설명을 제공

## 5) 데이터 모델 (기본 스키마)

아래 데이터 모델은 간단한 블로그 요구사항을 만족하도록 설계한 기본 스키마입니다. 실제 DB 타입(예: Postgres)은 선택에 따라 조정 가능합니다.

- 관계 요약
  - 한 명의 `user`는 여러 `post`를 작성할 수 있다. (1:N)

- `users` 테이블 (권장컬럼)
  - id: UUID (PK)
  - email: string, unique, not null
  - name: string
  - bio: text, nullable
  - avatar_url: string, nullable
  - created_at: timestamp, default now()
  - updated_at: timestamp, nullable

- `posts` 테이블 (권장컬럼)
  - id: UUID (PK)
  - author_id: UUID (FK -> users.id), not null
  - title: string, not null
  - slug: string, unique, not null
  - content: text, not null
  - excerpt: text, nullable
  - status: enum('draft','published'), default 'draft'
  - published_at: timestamp, nullable
  - created_at: timestamp, default now()
  - updated_at: timestamp, nullable
  - deleted_at: timestamp, nullable (soft delete)

- 인덱스/제약
  - users.email: unique index
  - posts.author_id: index (조회 성능)
  - posts.slug: unique index (빠른 조회)

- 간단한 API 계약(참고)
  - Create Post (POST /api/posts)
    - Request body: { title, content, author_id }
    - Response: 201 + { id }
  - Read Post (GET /api/posts/:id or /api/posts?slug=...)
  - List Posts (GET /api/posts?page=&limit=&q=)
    - 페이지네이션(또는 cursor 기반)을 권장
  - Update/Delete: 인증/권한 검사 필요

- 보안/운영 고려사항
  - 인증: JWT 또는 세션 기반 인증 이후 author_id 연계
  - 권한: 작성자만 편집/삭제 허용
  - 입력 검증/콘텐츠 사이징: 최대 길이 제한 및 XSS 방지
  - 마이그레이션: 초기 스키마는 위 컬럼으로 시작하되, 이후 태그/카테고리/댓글 기능 추가 예정

## 부록 — 구현 메모 (현재 코드와의 연결)

- 현재 레포지토리의 구현(참고)
	- `app/posts/page.tsx`는 서버에서 외부 API(예: jsonplaceholder)로부터 초기 데이터를 가져오고, `PostsClient`라는 클라이언트 컴포넌트가 검색/삭제를 처리합니다.
	- `app/posts/new/page.tsx`는 클라이언트 폼으로 간단한 검증 후 라우팅을 수행합니다。

---

필요하면 이 파일을 기반으로 컴포넌트 템플릿 파일들(`components/ui/*` 및 `components/*.tsx`)과 DB 마이그레이션 스크립트 템플릿을 제가 생성해 드리겠습니다.

