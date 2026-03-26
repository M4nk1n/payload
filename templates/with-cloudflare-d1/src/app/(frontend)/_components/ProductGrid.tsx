import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl, type ProductDoc, type CategoryDoc } from '../_lib/api'
import { statusLabel } from '../_lib/utils'

// async Server Component — Next.js 支持在 JSX 里直接 await
export async function ProductGrid({ products }: { products: ProductDoc[] }) {
  // 并发 resolve 所有封面 URL，避免串行 await
  const coverUrls = await Promise.all(products.map((p) => mediaUrl(p.coverImage)))

  return (
    <div className="product-grid">
      {products.map((product, i) => {
        const cover = coverUrls[i]
        const category =
          typeof product.category === 'object' && product.category
            ? (product.category as CategoryDoc)
            : null

        return (
          <Link key={product.id} href={`/products/${product.slug}`} className="product-card">
            <div className="product-card-img">
              {cover ? (
                <Image src={cover} alt={product.name} fill sizes="400px" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="product-card-img-placeholder">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 32l8-10 6 7 4-5 6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
