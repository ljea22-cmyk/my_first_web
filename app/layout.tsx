import "./globals.css";
import Link from "next/link";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white">
          <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
            <div className="text-lg font-semibold">내 블로그</div>

            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm px-2 py-1 hover:underline">
                홈
              </Link>

              <Link href="/posts" className="text-sm px-2 py-1 hover:underline">
                블로그
              </Link>

              <Link
                href="/posts/new"
                className="text-sm bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
              >
                새 글 쓰기
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </main>

        <footer className="text-center text-gray-500 py-6">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
