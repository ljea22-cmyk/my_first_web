"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import confetti from "canvas-confetti";

type Props = {
  postUserId?: string | null;
  postId: string;
};

export default function PostActions({ postUserId, postId }: Props) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data, error } = await supabase.auth.getUser();
        if (mounted) setCurrentUserId(error ? null : (data.user?.id ?? null));
      } catch {
        if (mounted) setCurrentUserId(null);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!postUserId || currentUserId === null || currentUserId !== postUserId) return null;

  const startEdit = async () => {
    setError(null);
    setEditing(true);
    try {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase
        .from("posts")
        .select("title, content")
        .eq("id", postId)
        .maybeSingle();
      if (error) { setError(error.message); return; }
      if (data) { setTitle(data.title ?? ""); setContent(data.content ?? ""); }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  const handleUpdate = async () => {
    setError(null);
    if (!title.trim()) { setError("제목을 입력하세요"); return; }
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase
        .from("posts")
        .update({ title: title.trim(), content: content.trim() })
        .eq("id", postId);
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/posts");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setLoading(false);
    }
  };

  const fireRain = () => {
    const duration = 1500;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 10,
        angle: 270,
        spread: 60,
        origin: { x: Math.random(), y: 0 },
        gravity: 2,
        scalar: 0.8,
        shapes: ["circle"],
        colors: ["#93c5fd", "#bae6fd", "#7dd3fc", "#e0f2fe"],
      });
    }, 100);
  };

  const handleDelete = async () => {
    setError(null);
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) { setError(error.message); setLoading(false); return; }
      fireRain();
      setTimeout(() => {
        router.push("/posts");
      }, 1500);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {!editing ? (
        <div className="flex gap-2">
          <button onClick={startEdit} className="px-4 py-1 bg-sky-200 text-white rounded-full hover:bg-sky-300 transition">수정</button>
          <button onClick={handleDelete} className="px-4 py-1 bg-red-300 text-white rounded-full hover:bg-red-400 transition">삭제</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">내용</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded px-3 py-2 h-36 resize-vertical" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={loading} className="px-4 py-1 bg-sky-200 text-white rounded-full hover:bg-sky-300 transition">
              {loading ? "저장 중..." : "저장"}
            </button>
            <button onClick={() => { setEditing(false); setError(null); }} disabled={loading} className="px-4 py-1 border rounded-full hover:bg-gray-100 transition">취소</button>
          </div>
        </div>
      )}
    </div>
  );
}