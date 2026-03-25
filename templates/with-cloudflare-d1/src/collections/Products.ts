import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'category', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── 基本信息 ────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '产品名称',
    },
    {
      name: 'model',
      type: 'text',
      label: '型号',
      admin: { description: '如：XR-2000A' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug（URL 路径）',
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      defaultValue: 'active',
      options: [
        { label: '在售', value: 'active' },
        { label: '停产', value: 'discontinued' },
        { label: '即将上市', value: 'coming_soon' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: '产品分类',
      index: true,
    },

    // ── 描述 ────────────────────────────────────
    {
      name: 'summary',
      type: 'textarea',
      label: '简介（列表页摘要）',
      admin: { description: '建议 60–120 字，显示在产品卡片上' },
    },
    {
      name: 'description',
      type: 'richText',
      label: '详细描述',
    },

    // ── 图片 ────────────────────────────────────
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: '封面图',
    },
    {
      name: 'gallery',
      type: 'array',
      label: '产品图集',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: '图片',
        },
        {
          name: 'caption',
          type: 'text',
          label: '说明文字',
        },
      ],
    },

    // ── 规格参数 ─────────────────────────────────
    {
      name: 'specs',
      type: 'array',
      label: '规格参数',
      admin: { description: '键值对形式，如「额定功率：7.5 kW」' },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: '参数名',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: '参数值',
        },
        {
          name: 'unit',
          type: 'text',
          label: '单位',
        },
      ],
    },

    // ── 应用场景 ─────────────────────────────────
    {
      name: 'applications',
      type: 'array',
      label: '应用场景',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: '场景名称',
        },
      ],
    },

    // ── 认证 ─────────────────────────────────────
    {
      name: 'certifications',
      type: 'array',
      label: '认证与标准',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: '认证名称',
          admin: { description: '如：CE、ISO 9001、GB/T 12345' },
        },
      ],
    },

    // ── SEO ──────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta 标题' },
        { name: 'description', type: 'textarea', label: 'Meta 描述' },
      ],
    },
  ],
  timestamps: true,
}
