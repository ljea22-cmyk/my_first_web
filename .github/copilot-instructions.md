# Copilot 지시사항

다음 지침은 이 리포지터리에서 코드 생성 시 Copilot(또는 유사 AI 도구)이 따를 규칙입니다.

## Tech Stack

- Next.js: 16.2.1 (App Router ONLY)
- Tailwind CSS: ^4

> 이 레포는 App Router 기반 구조를 사용합니다. `pages/` 디렉토리(구 Pages Router)는 사용하지 마세요.

## Coding Conventions

- 기본 컴포넌트 유형: Server Component
  - 가능한 한 서버 컴포넌트로 작성하세요(특별한 이유가 있을 때만 클라이언트 컴포넌트 사용).
- 스타일: Tailwind CSS만 사용
  - CSS 모듈, styled-components, emotion 등 다른 스타일 라이브러리는 사용하지 마세요.

## Known AI Mistakes / 금지 목록

- `next/router` 사용 금지 — 대신 `next/navigation`을 사용하세요.
- Pages Router(즉, `pages/` 기반 라우팅) 사용 금지 — App Router만 사용합니다.
- `params` 처리 시 `await` 사용은 필수입니다 (params는 await 필수).

---

추가 지시나 예외가 있을 경우 해당 이슈나 PR에 명시해주세요.
