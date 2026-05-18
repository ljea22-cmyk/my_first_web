import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type PostRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  user_id: string | null;
};

async function fetchPosts(): Promise<PostRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars")
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export default async function PostsPage() {
  let posts: PostRow[] = [];
  let errorMessage = "";

  try {
    posts = await fetchPosts();
  } catch (err) {
    // minimal error message
    errorMessage = "데이터를 불러오지 못했습니다.";
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>

      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : posts.length === 0 ? (
        <p>포스트가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <article key={p.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold">
                <Link href={`/posts/${p.id}`}>{p.title ?? "제목 없음"}</Link>
              </h2>
              <p className="text-sm text-gray-600 mt-2">{p.content ? p.content.slice(0, 140) : ""}{p.content && p.content.length > 140 ? '…' : ''}</p>
              <p className="text-xs text-gray-400 mt-2">작성자 ID: {p.user_id ?? '알수없음'} • {p.created_at ? new Date(p.created_at).toISOString().slice(0,10) : ''}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
