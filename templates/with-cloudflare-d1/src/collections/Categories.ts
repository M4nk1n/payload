import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: '分类名称',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug（URL 路径）',
      admin: { description: '用于 URL，仅限小写字母、数字和连字符，如 industrial-robots' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '分类描述',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: '分类图标',
    },
  ],
}
