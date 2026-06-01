"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const REACTIONS = ["❤️", "👍", "😆", "🔥", "🥹"];

export default function LikeButton({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const storageKey = `reaction-${postId}-${user?.id}`;

  const fetchLikes = async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId);
    setCount(data?.length ?? 0);
    if (user) {
      setLiked(data?.some((l) => l.user_id === user.id) ?? false);
    }
  };

  useEffect(() => {
    fetchLikes();
    // localStorage에서 저장된 이모지 인덱스 불러오기
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setReactionIndex(parseInt(saved));
    }
  }, [postId, user]);

  const handleClick = async (index: number) => {
    if (!user || loading) return;
    setLoading(true);
    const supabase = createBrowserSupabase();

    if (liked && reactionIndex === index) {
      // 같은 거 누르면 취소
      await supabase.from("likes").delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      setLiked(false);
      localStorage.removeItem(storageKey);
    } else {
      if (!liked) {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });
      }
      setLiked(true);
      setReactionIndex(index);
      localStorage.setItem(storageKey, String(index));
    }

    await fetchLikes();
    setLoading(false);
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex gap-1">
        {REACTIONS.map((emoji, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`text-xl px-2 py-1 rounded-full transition hover:scale-125 ${
              liked && reactionIndex === i ? "bg-sky-100 scale-125" : ""
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">{count}개</span>
    </div>
  );
}