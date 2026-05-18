"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

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

  // Note: This client-side check is only for UX (showing/hiding buttons).
  // Real authorization must be enforced via RLS (Ch11).
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

  const handleDelete = async () => {
    setError(null);
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/posts");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {!editing ? (
        <div className="flex gap-2">
          <button onClick={startEdit} className="px-3 py-1 bg-indigo-600 text-white rounded">수정</button>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">삭제</button>
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
            <button onClick={handleUpdate} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">
              {loading ? "저장 중..." : "저장"}
            </button>
            <button onClick={() => { setEditing(false); setError(null); }} disabled={loading} className="px-3 py-1 border rounded">취소</button>
          </div>
        </div>
      )}
    </div>
  );
}