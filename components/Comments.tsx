"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likeCount?: number;
  liked?: boolean;
};

export default function Comments({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const supabase = createBrowserSupabase();
    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!commentData) return;

    const { data: likeData } = await supabase
      .from("comment_likes")
      .select("*");

    const enriched = commentData.map((c) => {
      const likes = likeData?.filter((l) => l.comment_id === c.id) ?? [];
      return {
        ...c,
        likeCount: likes.length,
        liked: user ? likes.some((l) => l.user_id === user.id) : false,
      };
    });

    // 베스트 댓글(2개 이상) 먼저, 나머지는 시간순
    const best = enriched.filter((c) => (c.likeCount ?? 0) >= 2);
    const normal = enriched.filter((c) => (c.likeCount ?? 0) < 2);
    setComments([...best, ...normal]);
  };

  useEffect(() => {
    fetchComments();
  }, [postId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setLoading(true);
    const supabase = createBrowserSupabase();
    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    });
    setContent("");
    await fetchComments();
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    const supabase = createBrowserSupabase();
    await supabase.from("comments").delete().eq("id", commentId);
    await fetchComments();
  };

  const handleLike = async (commentId: string, liked: boolean) => {
    if (!user) return;
    const supabase = createBrowserSupabase();
    if (liked) {
      await supabase.from("comment_likes").delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: user.id,
      });
    }
    await fetchComments();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">댓글 {comments.length}개</h2>

      <ul className="space-y-3 mb-6">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">댓글이 없습니다.</p>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            className={`rounded p-3 ${
              (c.likeCount ?? 0) >= 2
                ? "bg-yellow-50 border border-yellow-300"
                : "bg-gray-50"
            }`}
          >
            {(c.likeCount ?? 0) >= 2 && (
              <p className="text-xs text-yellow-500 font-bold mb-1">⭐ 베스트 댓글</p>
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-700">{c.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.created_at).toISOString().slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleLike(c.id, c.liked ?? false)}
                  className={`text-xs px-2 py-1 rounded-full transition ${
                    c.liked
                      ? "bg-red-100 text-red-500"
                      : "bg-gray-100 text-gray-400 hover:bg-red-50"
                  }`}
                >
                  ❤️ {c.likeCount}
                </button>
                {user?.id === c.user_id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 border rounded-full px-4 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-200 text-white px-4 py-2 rounded-full text-sm hover:bg-sky-300 disabled:opacity-50 transition"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-400">댓글을 작성하려면 로그인하세요.</p>
      )}
    </div>
  );
}