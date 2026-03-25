import Link from "next/link";

export default function Home() {
  const site = {
    title: "잰니 일기장~ㅋㅋ",
    subtitle: "어서오시긔",
  };

  const posts = [
    {
      title: "첫 번째 글: 집에 가고싶다",
      slug: "getting-started",
      date: "2026-03-25",
      excerpt: "집에가서 닌텐도나 하고싶어~!!",
    },
    {
      title: "Next.js App Router 정리",
      slug: "nextjs-app-router",
      date: "2026-03-20",
      excerpt: "App Router의 기본 개념과 사용 팁을 정리합니다.",
    },
    {
      title: "Tailwind로 깔끔한 UI 만들기",
      slug: "tailwind-ui",
      date: "2026-03-18",
      excerpt: "유용한 Tailwind 유틸리티와 레이아웃 패턴을 공유합니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">{site.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">{site.subtitle}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  <Link href={`/posts/${post.slug}`} className="text-black dark:text-zinc-50 hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{post.date}</div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-4">{post.excerpt}</p>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-zinc-700 dark:text-zinc-300 text-sm">간단한 자기소개와 연락처, 소셜 링크를 여기에 배치하세요.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
