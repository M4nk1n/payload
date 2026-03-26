/**
 * 所有前台数据获取统一走 REST API，不使用 Local API（getPayload）。
 * 原因：Cloudflare Workers 环境下前台路由拿不到 PAYLOAD_SECRET 绑定。
 *
 * Base URL 通过 Next.js `headers()` 动态读取当前请求的 host，
 * 无需任何环境变量，本地开发和生产环境自动适配。
 */

import { headers } from 'next/headers'

async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}`
}

interface FetchOptions {
  cache?: RequestCache
  next?: NextFetchRequestConfig
}

async function payloadFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const base = await getBaseUrl()
  const res = await fetch(`${base}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: opts.cache ?? 'no-store',
    next: opts.next,
  })
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ── Types (lightweight, avoid importing payload-types on frontend) ────────────

export interface MediaDoc {
  id: string
  url?: string | null
  filename?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filesize?: number | null
  mimeType?: string | null
}

export interface CategoryDoc {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: MediaDoc | string | null
}

export interface SpecItem {
  key: string
  value: string
  unit?: string | null
}

export interface GalleryItem {
  image: MediaDoc | string
  caption?: string | null
}

export interface CertItem { name: string }
export interface AppItem  { label: string }

export interface ProductDoc {
  id: string
  name: string
  slug: string
  model?: string | null
  status?: 'active' | 'discontinued' | 'coming_soon' | null
  category?: CategoryDoc | string | null
  summary?: string | null
  coverImage?: MediaDoc | string | null
  gallery?: GalleryItem[]
  specs?: SpecItem[]
  applications?: AppItem[]
  certifications?: CertItem[]
  seo?: { title?: string | null; description?: string | null }
  updatedAt?: string
  createdAt?: string
}

export interface DocumentDoc {
  id: string
  title: string
  type: string
  product?: ProductDoc | string | null
  file?: MediaDoc | string | null
  language?: string | null
  version?: string | null
  description?: string | null
  updatedAt?: string
}

interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

// ── Query builders ────────────────────────────────────────────

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v))
  }
  return q.toString() ? `?${q.toString()}` : ''
}

// ── API calls ─────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryDoc[]> {
  const data = await payloadFetch<PaginatedResponse<CategoryDoc>>(
    `/categories${buildQuery({ limit: 20, sort: 'name', depth: 1 })}`,
    { next: { revalidate: 300 } },
  )
  return data.docs
}

export async function getFeaturedProducts(limit = 6): Promise<{ docs: ProductDoc[]; totalDocs: number }> {
  const data = await payloadFetch<PaginatedResponse<ProductDoc>>(
    `/products${buildQuery({ limit, sort: '-updatedAt', depth: 2, 'where[status][equals]': 'active' })}`,
    { next: { revalidate: 60 } },
  )
  return { docs: data.docs, totalDocs: data.totalDocs }
}

export async function getProducts(opts: {
  categoryId?: string
  q?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<ProductDoc>> {
  const params: Record<string, string | number | undefined> = {
    limit: opts.limit ?? 12,
    page: opts.page ?? 1,
    sort: '-updatedAt',
    depth: 2,
  }
  if (opts.categoryId) params['where[category][equals]'] = opts.categoryId
  if (opts.q)          params['where[name][contains]']  = opts.q

  return payloadFetch<PaginatedResponse<ProductDoc>>(
    `/products${buildQuery(params)}`,
    { cache: 'no-store' },
  )
}

export async function getProductBySlug(slug: string): Promise<ProductDoc | null> {
  const data = await payloadFetch<PaginatedResponse<ProductDoc>>(
    `/products${buildQuery({ 'where[slug][equals]': slug, depth: 2, limit: 1 })}`,
    { next: { revalidate: 60 } },
  )
  return data.docs[0] ?? null
}

export async function getDocumentsForProduct(productId: string): Promise<DocumentDoc[]> {
  const data = await payloadFetch<PaginatedResponse<DocumentDoc>>(
    `/documents${buildQuery({ 'where[product][equals]': productId, sort: 'type', depth: 2, limit: 50 })}`,
    { next: { revalidate: 60 } },
  )
  return data.docs
}

export async function getRelatedProducts(opts: {
  categoryId?: string
  excludeSlug: string
  limit?: number
}): Promise<ProductDoc[]> {
  const params: Record<string, string | number | undefined> = {
    limit: opts.limit ?? 4,
    depth: 2,
    sort: '-updatedAt',
    'where[slug][not_equals]': opts.excludeSlug,
  }
  if (opts.categoryId) params['where[category][equals]'] = opts.categoryId

  const data = await payloadFetch<PaginatedResponse<ProductDoc>>(
    `/products${buildQuery(params)}`,
    { next: { revalidate: 60 } },
  )
  return data.docs
}

// ── Media helpers ─────────────────────────────────────────────

export function resolveMedia(m: MediaDoc | string | null | undefined): MediaDoc | null {
  if (!m) return null
  if (typeof m === 'string') return null   // not populated
  return m
}

/**
 * R2 上传的文件 url 已经是完整的 https://... 绝对路径，直接返回。
 * 本地开发时 url 是相对路径（如 /media/xxx.jpg），拼上当前 host 即可。
 * 调用方需保证在 Server Component 里使用（依赖 headers()）。
 */
export async function mediaUrl(m: MediaDoc | string | null | undefined): Promise<string> {
  const doc = resolveMedia(m)
  if (!doc?.url) return ''
  if (doc.url.startsWith('http')) return doc.url
  const base = await getBaseUrl()
  return `${base}${doc.url}`
}
