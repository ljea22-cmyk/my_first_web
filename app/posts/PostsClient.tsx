"use client"

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Post } from "../../lib/posts";
import SearchBar from "./SearchBar";

type Props = {
  initialPosts: Post[];
};

export default function PostsClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(q));
  }, [posts, query]);

  const handleSearch = (q: string) => setQuery(q);

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SearchBar onSearch={handleSearch} />
        <Link href="/posts/new" className="ml-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          새 글 작성
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">{post.title}</h2>

              <div className="flex items-center gap-2">
                <Link href={`/posts/${post.id}`} className="text-sm text-indigo-600 hover:underline ml-4">#{post.id}</Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm text-red-600 hover:underline ml-2"
                >
                  삭제
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-2">{post.content.slice(0, 120)}{post.content.length > 120 ? '…' : ''}</p>
            <p className="text-xs text-gray-400 mt-4">작성자: {post.author} • {post.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
