import Link from 'next/link'
import { getCategories } from '../_lib/api'

interface NavProps {
  activePath?: string
}

export async function Navbar({ activePath = '/' }: NavProps) {
  const categories = await getCategories()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">M</div>
          <span className="nav-logo-name">MACH·PRO</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className={`nav-link${activePath === '/' ? ' active' : ''}`}>
            首页
          </Link>
          <Link href="/products" className={`nav-link${activePath.startsWith('/products') ? ' active' : ''}`}>
            产品中心
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="nav-link"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <Link href="/products" className="nav-contact">
          产品目录 →
        </Link>
      </div>
    </nav>
  )
}
