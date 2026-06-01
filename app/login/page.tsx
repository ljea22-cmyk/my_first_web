"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/auth'
import { getErrorMessage } from '@/lib/error-message'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signInWithEmail(email, password)

    setLoading(false)

    if (res?.error) {
      setError(getErrorMessage(res.error))
      return
    }

    router.push('/posts')
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">로그인</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded-full px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded-full px-3 py-2"
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-200 text-white px-4 py-2 rounded-full hover:bg-sky-300 disabled:opacity-50 font-medium transition"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>
    </div>
  )
}