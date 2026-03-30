import Link from "next/link";

export default function Home() {
  const site = {
    title: "잰니 일기장",
    subtitle: "간단한 블로그 샘플 사이트",
  };

  const posts = [
    {
      title: "집 가서 할 일: 닌텐도",
      slug: "getting-started",
      date: "2026-03-25",
      author: "잰니",
      excerpt: "DLC를 사서 물짱이 잡아야겠음",
    },
    {
      title: "Next.js App Router 정리",
      slug: "nextjs-app-router",
      date: "2026-03-20",
      author: "잰니",
      excerpt: "App Router의 기본 개념과 사용 팁을 정리합니다.",
    },
    {
      title: "Tailwind로 깔끔한 UI 만들기",
      slug: "tailwind-ui",
      date: "2026-03-18",
      author: "잰니",
      excerpt: "유용한 Tailwind 유틸리티와 레이아웃 패턴을 공유합니다.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">{site.title}</h1>
        <p className="text-gray-500">{site.subtitle}</p>
        <nav className="mt-3">
          <ul className="flex gap-4">
            <li>
              <Link href="/" className="text-sm text-gray-700">Home</Link>
            </li>
            <li>
              <Link href="/about" className="text-sm text-gray-700">About</Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-gray-700">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-lg font-bold">
                <Link href={`/posts/${post.slug}`} className="text-inherit">{post.title}</Link>
              </h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <p className="text-sm text-gray-400 mt-4">
                <strong className="font-medium text-gray-700">작성자:</strong> {post.author} <span className="mx-2">•</span> <strong className="font-medium text-gray-700">작성일:</strong> {post.date}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <small>© {new Date().getFullYear()} {site.title}</small>
      </footer>
    </div>
  );
}
