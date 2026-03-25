import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: '120px 0' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <p className="section-eyebrow">404</p>
        <h1 className="section-title">PAGE<em> NOT FOUND</em></h1>
        <p style={{ color: 'var(--ink2)', fontWeight: 300, marginTop: 16, marginBottom: 32 }}>
          请求的页面不存在，产品可能已下线或链接有误。
        </p>
        <Link href="/products" className="btn btn-primary">← 返回产品中心</Link>
      </div>
    </div>
  )
}
