import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories, getProducts, mediaUrl, type ProductDoc, type CategoryDoc } from '../_lib/api'
import { statusLabel } from '../_lib/utils'

export const metadata: Metadata = { title: '产品中心' }

const LIMIT = 12

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category: catSlug, q, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))

  const categories = await getCategories()

  // resolve category id from slug
  const activeCat = catSlug ? categories.find((c) => c.slug === catSlug) : undefined
  const categoryId = activeCat?.id

  const { docs: products, totalDocs, totalPages } = await getProducts({
    categoryId, q, page, limit: LIMIT,
  })

  const from = (page - 1) * LIMIT + 1
  const to = Math.min(page * LIMIT, totalDocs)

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const merged = { category: catSlug, q, page: String(page), ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    const s = p.toString()
    return `/products${s ? `?${s}` : ''}`
  }

  return (
    <>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--line)', padding: '40px 0 0' }}>
        <div className="container">
          <p className="section-eyebrow">产品中心</p>
          <h1 className="section-title" style={{ marginBottom: 6 }}>
            {activeCat ? activeCat.name.toUpperCase() : 'ALL PRODUCTS'}
          </h1>
          {activeCat?.description && (
            <p style={{ color: 'var(--ink2)', fontSize: 14, fontWeight: 300, marginTop: 8 }}>
              {activeCat.description}
            </p>
          )}
          <div className="category-bar">
            <Link href="/products" className={`cat-chip${!catSlug ? ' active' : ''}`}>全部</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={buildUrl({ category: cat.slug, page: '1' })}
                className={`cat-chip${catSlug === cat.slug ? ' active' : ''}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Search toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <form action="/products" method="GET" style={{ flex: 1, display: 'flex', gap: 8 }}>
              {catSlug && <input type="hidden" name="category" value={catSlug} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 'var(--r)', padding: '8px 14px', width: 280 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink3)', flexShrink: 0 }}>
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input name="q" defaultValue={q ?? ''} placeholder="搜索产品名称…"
                  style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--ff-body)', fontSize: 13, color: 'var(--ink)', width: '100%' }} />
              </div>
            </form>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.5, marginLeft: 'auto' }}>
              共 {totalDocs} 件产品
            </span>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">⚙️</div>
              <p className="empty-text">{q || catSlug ? '没有符合条件的产品' : '暂无产品，请在后台添加'}</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product: ProductDoc) => {
                const cover = mediaUrl(product.coverImage)
                const category = typeof product.category === 'object' && product.category
                  ? (product.category as CategoryDoc) : null
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="product-card">
                    <div className="product-card-img">
                      {cover ? (
                        <Image src={cover} alt={product.name} fill sizes="400px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="product-card-img-placeholder">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M16 32l8-10 6 7 4-5 6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      {product.status && (
                        <span className={`product-card-status status-${product.status}`}>{statusLabel(product.status)}</span>
                      )}
                    </div>
                    <div className="product-card-body">
                      {category && <span className="product-card-category">{category.name}</span>}
                      <h2 className="product-card-name">{product.name}</h2>
                      {product.model && <span className="product-card-model">MODEL: {product.model}</span>}
                      {product.summary && <p className="product-card-summary">{product.summary}</p>}
                    </div>
                    <div className="product-card-footer">
                      <span>{product.specs?.length ?? 0} 项参数</span>
                      <span className="product-card-arrow">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 32, justifyContent: 'center' }}>
              {page > 1 && (
                <Link href={buildUrl({ page: String(page - 1) })} className="btn btn-outline" style={{ padding: '8px 16px' }}>← 上一页</Link>
              )}
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--ink3)', padding: '0 16px' }}>
                {from}–{to} / {totalDocs}
              </span>
              {page < totalPages && (
                <Link href={buildUrl({ page: String(page + 1) })} className="btn btn-outline" style={{ padding: '8px 16px' }}>下一页 →</Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
