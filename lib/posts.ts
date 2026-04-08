export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string; // ISO or YYYY-MM-DD
};

export const posts: Post[] = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content: "이것은 더미 콘텐츠입니다. 첫 번째 게시글의 본문을 여기에 넣습니다.",
    author: "관리자",
    date: "2026-03-01",
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content: "두 번째 게시글의 예시 내용입니다. 간단한 설명과 샘플 텍스트를 포함합니다.",
    author: "에디터",
    date: "2026-03-10",
  },
  {
    id: 3,
    title: "세 번째 게시글",
    content: "세 번째 더미 게시물입니다. 실제 서비스에서는 마크다운이나 HTML을 사용할 수 있습니다.",
    author: "기여자",
    date: "2026-03-20",
  },
];
