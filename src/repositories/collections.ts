// Central place for default Strapi collection slugs.
export enum CollectionName {
  Article = 'articles',
  Category = 'categories',
  Page = 'pages',
  Product = 'products',
}

export const defaultCollections = {
  article: CollectionName.Article,
  category: CollectionName.Category,
  page: CollectionName.Page,
  product: CollectionName.Product,
} as const

export type CollectionKey = keyof typeof defaultCollections
