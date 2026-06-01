import "./globals.css";
import NavBar from "@/components/NavBar";
import AuthProviderWrapper from "@/providers/AuthProviderWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col text-gray-900 dark:bg-gray-900 dark:text-gray-100 dotted-bg">
        <AuthProviderWrapper>
          <NavBar />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto p-6">{children}</div>
          </main>
        </AuthProviderWrapper>

        <footer className="text-center text-gray-400 py-6 text-sm">
          © 2026 1학기 웹프로그래밍
        </footer>
      </body>
    </html>
  );
}