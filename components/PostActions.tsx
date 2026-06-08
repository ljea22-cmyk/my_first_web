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
  const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [newMediaType, setNewMediaType] = useState<"image" | "video" | null>(null);
  const [removeMedia, setRemoveMedia] = useState(false);
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
    setRemoveMedia(false);
    setNewFile(null);
    setNewPreview(null);
    setNewMediaType(null);
    try {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, image_url")
        .eq("id", postId)
        .maybeSingle();
      if (error) { setError(error.message); return; }
      if (data) {
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setExistingMediaUrl(data.image_url ?? null);
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError("파일 크기가 50MB를 초과합니다");
      return;
    }
    setNewFile(file);
    setNewMediaType(file.type.startsWith("video/") ? "video" : "image");
    setNewPreview(URL.createObjectURL(file));
    setRemoveMedia(false);
  };

  const handleUpdate = async () => {
    setError(null);
    if (!title.trim()) { setError("제목을 입력하세요"); return; }
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();

      let imageUrl = existingMediaUrl;

      if (removeMedia) {
        imageUrl = null;
      }

      if (newFile && currentUserId) {
        const ext = newFile.name.split(".").pop();
        const path = `${currentUserId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(path, newFile);
        if (uploadError) {
          setError("파일 업로드 실패: " + uploadError.message);
          setLoading(false);
          return;
        }
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("posts")
        .update({ title: title.trim(), content: content.trim(), image_url: imageUrl })
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
      if (Date.now() > end) { clearInterval(interval); return; }
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
      setTimeout(() => { router.push("/posts"); }, 1500);
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">첨부 파일</label>

            {/* 기존 미디어 미리보기 */}
            {existingMediaUrl && !removeMedia && !newPreview && (
              <div className="mb-2">
                {existingMediaUrl.match(/\.(mp4|mov|webm|avi)$/i) ? (
                  <video src={existingMediaUrl} controls className="rounded max-h-48 w-full" />
                ) : (
                  <img src={existingMediaUrl} alt="기존 첨부" className="rounded max-h-48 object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => setRemoveMedia(true)}
                  className="mt-1 text-sm text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            )}

            {/* 새 파일 미리보기 */}
            {newPreview && (
              <div className="mb-2">
                {newMediaType === "video" ? (
                  <video src={newPreview} controls className="rounded max-h-48 w-full" />
                ) : (
                  <img src={newPreview} alt="새 첨부" className="rounded max-h-48 object-cover" />
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">새 파일을 선택하면 기존 파일이 교체됩니다 (최대 50MB)</p>
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