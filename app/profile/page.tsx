"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) fetchAvatar();
  }, [user, loading]);

  const fetchAvatar = async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user!.id)
      .single();
    setAvatarUrl(data?.avatar_url ?? null);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const supabase = createBrowserSupabase();
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setAvatarUrl(publicUrl);
    setUploading(false);
  };

  if (loading) return <p className="text-gray-500">로딩 중...</p>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">프로필</h1>

      <div className="flex flex-col items-center mb-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="프로필 사진"
            className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-yellow-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-3 text-3xl">
            👤
          </div>
        )}
        <label className="cursor-pointer text-sm text-sky-500 hover:underline">
          {uploading ? "업로드 중..." : "사진 변경"}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">이메일</p>
          <p className="text-gray-800 font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">사용자 ID</p>
          <p className="text-gray-800 text-sm">{user.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">가입일</p>
          <p className="text-gray-800">
            {new Date(user.created_at).toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
    </div>
  );
}