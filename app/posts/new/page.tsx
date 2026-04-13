"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!title.trim()) {
      // simple validation: title required
      alert("제목을 입력하세요");
      return;
    }
    // 백엔드가 아직 없으므로 alert 표시 후 posts로 이동
    alert("저장되었습니다");
    router.push("/posts");
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

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            disabled={!content.trim()}
          >
            저장
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
