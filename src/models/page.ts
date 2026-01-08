export interface Page {
  id: number
  documentId?: string
  title: string
  slug: string
  primarypage: boolean
  description?: string | null
  dynamic?: Array<{
    __component: string
    id: number
    [key: string]: any
  }>
  seo?: import('./seo.js').SeoMeta
  createdAt: string
  updatedAt: string
  publishedAt: string
}
