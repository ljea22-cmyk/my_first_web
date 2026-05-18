export type Post = {
  id: string;
  title: string;
  content: string;
  user_id: string | null;
  created_at: string; // ISO
};

// Mock data updated to match Ch8 schema: id (string/uuid), user_id, created_at
export const posts: Post[] = [
  {
    id: "1",
    title: "첫 번째 게시글",
    content: "이것은 첫 번째 게시글의 예시 내용입니다.",
    user_id: "user_aaa",
    created_at: "2026-03-01",
  },
  {
    id: "2",
    title: "두 번째 게시글",
    content: "두 번째 게시글의 예시 내용입니다.",
    user_id: "user_bbb",
    created_at: "2026-03-10",
  },
  {
    id: "3",
    title: "세 번째 게시글",
    content: "세 번째 게시글의 예시 내용입니다.",
    user_id: "user_ccc",
    created_at: "2026-03-20",
  },
];
