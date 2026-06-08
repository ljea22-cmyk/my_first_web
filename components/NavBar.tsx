"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function NavBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-yellow-100 text-gray-900 shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-lg font-bold text-yellow-600">잰니의 블로그</div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="text-sm px-2 py-1 hover:underline">
            홈
          </Link>
          <Link href="/posts" className="text-sm px-2 py-1 hover:underline">
            블로그
          </Link>

          {user ? (
            <>
              <Link
                href="/posts/new"
                className="text-sm bg-yellow-300 px-3 py-1 rounded-full hover:bg-yellow-400 font-medium"
              >
                새 글 쓰기
              </Link>
              <Link
                href="/profile"
                className="text-sm px-2 py-1 hover:underline"
              >
                프로필
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm bg-red-300 px-3 py-1 rounded-full hover:bg-red-400 font-medium"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-2 py-1 hover:underline">
                로그인
              </Link>
              <Link href="/signup" className="text-sm px-2 py-1 hover:underline">
                회원가입
              </Link>
            </>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}