import { notFound } from "next/navigation";
import Link from "next/link";
import { posts as localPosts, type Post } from "../../../lib/posts";

type Props = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: Props) {
  // repo convention: await params handling
  const { id } = await Promise.resolve(params);

  let post: Post | undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (res.ok) {
      const d = await res.json();
      post = {
        id: d.id,
        title: d.title,
        content: d.body,
        author: `User ${d.userId}`,
        date: new Date().toISOString().slice(0, 10),
      };
    }
  } catch (e) {
    // ignore
  }

  if (!post) {
    post = localPosts.find((p) => p.id === Number(id));
  }

  if (!post) {
      return (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-lg font-semibold text-gray-700">게시글을 찾을 수 없습니다</p>
            <Link href="/posts" className="mt-4 inline-block text-indigo-600 hover:underline">
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      );
    }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <article className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <Link href="/posts" className="text-sm text-indigo-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>

        <p className="text-sm text-gray-500">작성자: {post.author} • {post.date}</p>
        <div className="mt-6 text-gray-700 whitespace-pre-line">{post.content}</div>
      </article>
    </div>
  );
}
