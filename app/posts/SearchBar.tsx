"use client"

import React, { useState } from "react";

type Props = {
  onSearch: (q: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onSearch(v);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="검색어를 입력하세요 (제목 기준)"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
