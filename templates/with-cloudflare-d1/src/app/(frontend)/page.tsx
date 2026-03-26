import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getFeaturedProducts } from './_lib/api'
import { ProductGrid } from './_components/ProductGrid'

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
