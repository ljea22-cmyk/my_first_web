export const revalidate = 0;

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SearchBar from "@/components/SearchBar";

type PostRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  user_id: string | null;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

async function fetchPosts(query?: string): Promise<PostRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  const supabase = createClient(url, key);

  let req = supabase
    .from("posts")
    .select("id, title, content, created_at, user_id, profiles(username, avatar_url)")
    .order("created_at", { ascending: false });

  if (query) {
    req = req.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }

  const { data, error } = await req;
  if (error) throw error;
  return (data as PostRow[]) ?? [];
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  let posts: PostRow[] = [];
  let errorMessage = "";

  try {
    posts = await fetchPosts(query);
  } catch (err) {
    errorMessage = "데이터를 불러오지 못했습니다.";
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>

      <SearchBar defaultValue={query} />

      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 mt-4">게시글이 없습니다.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {posts.map((p) => (
            <article key={p.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold">
                <Link href={`/posts/${p.id}`}>{p.title ?? "제목 없음"}</Link>
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {p.content ? p.content.slice(0, 140) : ""}
                {p.content && p.content.length > 140 ? "…" : ""}
              </p>
              <div className="flex items-center gap-2 mt-3">
                {p.profiles?.avatar_url ? (
                  <img
                    src={p.profiles.avatar_url}
                    alt="프로필"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs">
                    👤
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  {p.profiles?.username ?? "알수없음"} •{" "}
                  {p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}