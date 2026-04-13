import PostsClient from "./PostsClient";
import { Post, posts as localPosts } from "../../lib/posts";

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6");
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    // map to local Post shape
    return data.map((d: any, idx: number) => ({
      id: d.id,
      title: d.title,
      content: d.body,
      author: `User ${d.userId}`,
      date: new Date().toISOString().slice(0, 10),
    }));
  } catch (e) {
    // fallback to local data
    return localPosts;
  }
}

export default async function PostsPage() {
  const initialPosts = await fetchPosts();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">게시글 목록</h1>
      {/* client component handles search & delete */}
      <PostsClient initialPosts={initialPosts} />
    </div>
  );
}
