export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const STATUS_LABELS: Record<string, string> = {
  active: '在售',
  discontinued: '停产',
  coming_soon: '即将上市',
}
export function statusLabel(s: string | null | undefined): string {
  return STATUS_LABELS[s ?? ''] ?? s ?? ''
}

const DOC_TYPE_LABELS: Record<string, string> = {
  manual: '产品手册',
  datasheet: '技术规格书',
  installation: '安装指南',
  maintenance: '维护手册',
  certificate: '合格证书',
  other: '其他',
}
export function docTypeLabel(t: string | null | undefined): string {
  return DOC_TYPE_LABELS[t ?? ''] ?? t ?? ''
}

export function docTypeIcon(t: string | null | undefined): string {
  const icons: Record<string, string> = {
    manual: '📘', datasheet: '📊', installation: '🔧',
    maintenance: '⚙️', certificate: '🏅', other: '📄',
  }
  return icons[t ?? ''] ?? '📄'
}
