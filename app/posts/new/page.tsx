"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (!loading && !user) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p>로그인이 필요합니다. 로그인 페이지로 이동합니다...</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!title.trim()) {
      setError("제목을 입력하세요");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력하세요");
      return;
    }
    if (!user) {
      setError("로그인이 필요합니다");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createBrowserSupabase();
      const res = await supabase.from("posts").insert([
        {
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
        },
      ]).select("id").single();

      if (res.error) {
        setError(res.error.message || String(res.error));
        setSubmitting(false);
        return;
      }

      const newPost = res.data;
      // Redirect to posts list or new post detail if id available
      if (newPost?.id) {
        router.push(`/posts/${newPost.id}`);
      } else {
        router.push("/posts");
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">새 포스트 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !title.trim()}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {touched && !title.trim() && (
            <p className="text-sm text-red-600 mt-1">제목은 비어있을 수 없습니다.</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
            className="w-full border rounded px-3 py-2 h-40 resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "저장 중..." : "저장"}
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => router.push("/posts")}
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
