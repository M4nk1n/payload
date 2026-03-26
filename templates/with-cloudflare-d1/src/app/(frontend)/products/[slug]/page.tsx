import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getProductBySlug, getDocumentsForProduct, getRelatedProducts,
  mediaUrl, type ProductDoc, type CategoryDoc, type MediaDoc, type DocumentDoc,
} from '../../_lib/api'
import { docTypeLabel, docTypeIcon, formatDate, formatBytes } from '../../_lib/utils'
import { GalleryClient } from './GalleryClient'
import { ProductGrid } from '../../_components/ProductGrid'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: '产品未找到' }
  return {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.summary ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const category =
    typeof product.category === 'object' && product.category
      ? (product.category as CategoryDoc)
      : null

  const [documents, related] = await Promise.all([
    getDocumentsForProduct(product.id),
    getRelatedProducts({ categoryId: category?.id, excludeSlug: slug }),
  ])

  // Build image list and resolve all URLs in parallel
  const coverImg = typeof product.coverImage === 'object' ? (product.coverImage as MediaDoc) : null
  const galleryImgs = (product.gallery ?? [])
    .map((g) => (typeof g.image === 'object' ? (g.image as MediaDoc) : null))
    .filter((img): img is MediaDoc => img !== null)
  const allImageDocs = [coverImg, ...galleryImgs].filter((img): img is MediaDoc => img !== null && !!img.url)

  const allImageUrls = await Promise.all(allImageDocs.map((img) => mediaUrl(img)))
  const galleryImages = allImageDocs.map((img, i) => ({
    url: allImageUrls[i],
    alt: img.alt ?? img.filename ?? '',
    width: img.width ?? 800,
    height: img.height ?? 600,
  })).filter((img) => !!img.url)

  // Resolve document file URLs
  const docFileUrls = await Promise.all(
    (documents as DocumentDoc[]).map((doc) =>
      mediaUrl(typeof doc.file === 'object' ? (doc.file as MediaDoc) : null)
    )
  )

  return (
    <>
      {/* ── HERO ── */}
      <div className="product-hero">
        <div className="container">
          <div className="product-hero-grid">

            {/* Left: info */}
            <div style={{ paddingBottom: 48 }}>
              <div className="product-hero-breadcrumb">
                <Link href="/">首页</Link>
                <span>/</span>
                <Link href="/products">产品中心</Link>
                {category && (
                  <>
                    <span>/</span>
                    <Link href={`/products?category=${category.slug}`}>{category.name}</Link>
                  </>
                )}
                <span>/</span>
                <span style={{ color: 'var(--ink2)' }}>{product.name}</span>
              </div>

              {category && <div className="product-hero-eyebrow">{category.name}</div>}
              <h1 className="product-hero-name">{product.name}</h1>
              {product.model && <div className="product-hero-model">型号 · {product.model}</div>}
              {product.summary && <p className="product-hero-summary">{product.summary}</p>}

              {/* Certifications + Applications */}
              {((product.certifications?.length ?? 0) > 0 || (product.applications?.length ?? 0) > 0) && (
                <div className="product-hero-tags">
                  {(product.certifications ?? []).map((c, i) => (
                    <span key={i} className="product-tag">{c.name}</span>
                  ))}
                  {(product.applications ?? []).map((a, i) => (
                    <span key={i} className="product-tag">{a.label}</span>
                  ))}
                </div>
              )}

              {/* Key specs preview */}
              {(product.specs?.length ?? 0) > 0 && (
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
                  {(product.specs ?? []).slice(0, 3).map((spec, i) => (
                    <div key={i} style={{ borderLeft: '2px solid var(--orange)', paddingLeft: 12 }}>
                      <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>
                        {spec.value}
                        {spec.unit && <span style={{ fontSize: 11, color: 'var(--ink3)', marginLeft: 4 }}>{spec.unit}</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
                        {spec.key}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: gallery (Client Component for interactivity) */}
            {galleryImages.length > 0 && <GalleryClient images={galleryImages} />}
          </div>
        </div>
      </div>

      {/* ── SPECS + DOCS + RELATED ── */}
      <section className="section">
        <div className="container">

          {/* Specs table */}
          {(product.specs?.length ?? 0) > 0 && (
            <>
              <div style={{ marginBottom: 32 }}>
                <p className="section-eyebrow">技术规格</p>
                <h2 className="section-title" style={{ fontSize: 32 }}>SPECIFICATIONS</h2>
              </div>
              <div style={{ marginBottom: 64, background: 'var(--bg2)', border: '1px solid var(--line)' }}>
                <table className="specs-table">
                  <tbody>
                    {(product.specs ?? []).map((spec, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                        <td>{spec.key}</td>
                        <td>
                          {spec.value}
                          {spec.unit && <span className="unit">{spec.unit}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <p className="section-eyebrow">技术文档</p>
                <h2 className="section-title" style={{ fontSize: 32 }}>DOCUMENTS</h2>
              </div>
              <div className="doc-list" style={{ marginBottom: 64 }}>
                {(documents as DocumentDoc[]).map((doc, i) => {
                  const fileUrl = docFileUrls[i]
                  const file = typeof doc.file === 'object' ? (doc.file as MediaDoc) : null
                  return (
                    <a
                      key={doc.id}
                      href={fileUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="doc-item"
                      download
                    >
                      <div className="doc-icon">{docTypeIcon(doc.type)}</div>
                      <div className="doc-info">
                        <div className="doc-title">{doc.title}</div>
                        <div className="doc-meta">
                          {doc.version && `版本 ${doc.version} · `}
                          {doc.language === 'zh' ? '中文' : doc.language === 'en' ? 'English' : '双语'}
                          {file?.filesize ? ` · ${formatBytes(file.filesize)}` : ''}
                          {doc.updatedAt ? ` · ${formatDate(doc.updatedAt)}` : ''}
                        </div>
                      </div>
                      <span className="doc-type-badge">{docTypeLabel(doc.type)}</span>
                      {fileUrl && <span className="doc-download">↓</span>}
                    </a>
                  )
                })}
              </div>
            </>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ marginBottom: 24 }}>
                <p className="section-eyebrow">相关产品</p>
                <h2 className="section-title" style={{ fontSize: 32 }}>RELATED</h2>
              </div>
              <ProductGrid products={related as ProductDoc[]} />
            </>
          )}
        </div>
      </section>
    </>
  )
}
