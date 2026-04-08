import Link from "next/link";
import { posts } from "../../lib/posts";

export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">{post.title}</h2>

              <Link
                href={`/posts/${post.id}`}
                className="text-sm text-indigo-600 hover:underline ml-4"
              >
                #{post.id}
              </Link>
            </div>

            <p className="text-gray-600 mt-2">{post.content.slice(0, 120)}{post.content.length > 120 ? '…' : ''}</p>
            <p className="text-xs text-gray-400 mt-4">작성자: {post.author} • {post.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
