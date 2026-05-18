import { notFound } from "next/navigation";
import Link from "next/link";
import PostActions from "@/components/PostActions";
import { createClient } from "@supabase/supabase-js";

type PostRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  user_id: string | null;
};

type Props = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: Props) {
  // repo convention: await params handling
  const { id } = await Promise.resolve(params);
  // Fetch from Supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // env missing -> notFound or throw; choose notFound to avoid leaking info
    notFound();
  }

  const supabase = createClient(url!, key!);

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, user_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // log could be added; show 404 to user
    notFound();
  }

  const post = data as PostRow | null;

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <article className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{post.title ?? "제목 없음"}</h1>
          <Link href="/posts" className="text-sm text-indigo-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>

        <p className="text-sm text-gray-500">작성자 ID: {post.user_id ?? "알수없음"} • {post.created_at ? new Date(post.created_at).toISOString().slice(0,10) : ''}</p>
  <div className="mt-6 text-gray-700 whitespace-pre-line">{post.content}</div>
  <PostActions postUserId={post.user_id} postId={post.id} />
      </article>
    </div>
  );
}
