import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Navbar } from './_components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s — MACH·PRO 工业设备', default: 'MACH·PRO 工业设备资料库' },
  description: '专业工业设备、自动化产品资料库与产品展示平台',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? '/'

  return (
    <html lang="zh-CN">
      <body>
        <Navbar activePath={pathname} />
        {children}
        <footer className="footer">
          <div className="footer-inner">
            <span className="footer-copy">© {new Date().getFullYear()} MACH·PRO Industrial · All rights reserved</span>
            <span className="footer-copy">Powered by Payload CMS</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
