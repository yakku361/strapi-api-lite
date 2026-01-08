import type { Author } from './author.js'
import type { Category } from './category.js'
import type { Block } from './block.js'
import type { SeoMeta } from './seo.js'
import type { Media } from './media.js'

export interface Article {
  id: number
  documentId?: string
  title: string
  description: string
  slug: string
  cover: string | Media | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  author: Author
  category: Category
  blocks: Block[]
  seo?: SeoMeta
}
