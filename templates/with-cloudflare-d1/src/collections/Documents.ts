import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'product', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '文档标题',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: '文档类型',
      options: [
        { label: '产品手册', value: 'manual' },
        { label: '技术规格书', value: 'datasheet' },
        { label: '安装指南', value: 'installation' },
        { label: '维护手册', value: 'maintenance' },
        { label: '合格证书', value: 'certificate' },
        { label: '其他', value: 'other' },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: '关联产品',
      index: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: '文件（PDF / 图纸等）',
    },
    {
      name: 'language',
      type: 'select',
      label: '语言',
      defaultValue: 'zh',
      options: [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' },
        { label: '双语', value: 'bilingual' },
      ],
    },
    {
      name: 'version',
      type: 'text',
      label: '版本号',
      admin: { description: '如：v2.1、Rev.C' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '文档说明',
    },
  ],
  timestamps: true,
}
