import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test('행복 경로: 로그인 → 새 글 작성 → 목록에서 확인', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD must be set in environment')
  }

  // 1) /login에서 로그인
  await page.goto(`${BASE}/login`)
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('**/posts**', { timeout: 15000 })

  // 2) /posts/new에서 제목/내용 입력 후 저장
  await page.goto(`${BASE}/posts/new`)
  // loading 끝날 때까지 기다리기
  await page.waitForSelector('label[for="title"]', { timeout: 10000 })

  const title = `E2E 포스트 ${Date.now()}`
  const content = 'Playwright E2E 테스트용 내용입니다.'

  await page.getByLabel('제목').fill(title)
  await page.getByLabel('내용').fill(content)
  await page.getByRole('button', { name: '저장' }).click()
  await page.waitForURL('**/posts**', { timeout: 10000 })

  // 3) /posts 목록에서 새 글 제목 확인
  await page.goto(`${BASE}/posts`)
  await expect(page.getByRole('link', { name: title })).toBeVisible()
})

test('거절 경로: 비로그인 상태로 /posts/new 접근 시 /login으로 리다이렉트', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(`${BASE}/posts/new`)

  await page.waitForURL('**/login**', { timeout: 5000 })
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()

  await context.close()
})