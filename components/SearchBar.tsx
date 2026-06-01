"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/posts?q=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제목 또는 내용 검색"
        className="flex-1 border rounded-full px-4 py-2 text-sm"
      />
      <button
        type="submit"
        className="bg-sky-200 text-white px-6 py-2 rounded-full hover:bg-sky-300 text-sm font-medium transition"
      >
        검색
      </button>
    </form>
  );
}