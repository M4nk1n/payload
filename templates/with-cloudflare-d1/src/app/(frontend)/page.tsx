import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCategories, getFeaturedProducts, mediaUrl, type CategoryDoc, type ProductDoc } from './_lib/api'
import { statusLabel } from './_lib/utils'

export const metadata: Metadata = { title: '首页' }

export default async function HomePage() {
  const [{ docs: products, totalDocs }, categories] = await Promise.all([
    getFeaturedProducts(6),
    getCategories(),
  ])

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-tag">工业设备资料库 · INDUSTRIAL EQUIPMENT DATABASE</div>
          <h1 className="hero-title">
            PRECISION
            <em>MACHINERY</em>
          </h1>
          <p className="hero-desc">
            专业工业设备、自动化系统与精密仪器资料库。提供完整的产品规格、技术文档与应用方案。
          </p>
          <div className="hero-actions">
            <Link href="/products" className="btn btn-primary">浏览产品目录</Link>
            <Link href="/products" className="btn btn-outline">技术文档下载</Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-val">{totalDocs}<span>+</span></div>
              <div className="hero-stat-label">产品型号</div>
            </div>
            <div>
              <div className="hero-stat-val">{categories.length}<span>+</span></div>
              <div className="hero-stat-label">产品类别</div>
            </div>
            <div>
              <div className="hero-stat-val">24<span>H</span></div>
              <div className="hero-stat-label">技术支持</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="section-sm" style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg2)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <p className="section-eyebrow">产品类别</p>
              <Link href="/products" style={{ fontSize: 12, color: 'var(--ink3)', fontFamily: 'var(--ff-mono)' }}>全部 →</Link>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} className="cat-chip">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p className="section-eyebrow">主打产品</p>
              <h2 className="section-title">FEATURED<em> PRODUCTS</em></h2>
            </div>
            <Link href="/products" className="btn btn-outline">查看全部</Link>
          </div>
          {products.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">⚙️</div>
              <p className="empty-text">产品数据库尚未录入内容，请在 Payload 后台添加产品</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ background: 'var(--bg2)', backgroundImage: 'var(--grid-bg)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '64px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <p className="section-eyebrow">技术支持</p>
            <h2 className="section-title" style={{ fontSize: 36 }}>需要技术资料？</h2>
            <p style={{ color: 'var(--ink2)', fontSize: 14, marginTop: 8, fontWeight: 300 }}>
              所有产品提供完整技术文档、安装指南与规格参数表
            </p>
          </div>
          <Link href="/products" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 14 }}>
            浏览产品目录 →
          </Link>
        </div>
      </section>
    </>
  )
}

const ProductGrid = ({ products }: { products: ProductDoc[] }) => {
  return (
    <div className="product-grid">
      {products.map((product) => {
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
                <span className={`product-card-status status-${product.status}`}>
                  {statusLabel(product.status)}
                </span>
              )}
            </div>
            <div className="product-card-body">
              {category && <span className="product-card-category">{category.name}</span>}
              <h3 className="product-card-name">{product.name}</h3>
              {product.model && <span className="product-card-model">MODEL: {product.model}</span>}
              {product.summary && <p className="product-card-summary">{product.summary}</p>}
            </div>
            <div className="product-card-footer">
              <span>{product.specs?.length ?? 0} 项规格参数</span>
              <span className="product-card-arrow">→</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
