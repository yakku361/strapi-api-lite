import type { Article } from '../models/article.js'
import type { CollectionRepository } from '../repositories/contracts.js'
import { createCollectionService, withDefaults } from './collection-service.js'
import { ArticlePopulate } from '../constants/populate.js'

const createBaseArticleService = (repository: CollectionRepository<Article>) =>
  createCollectionService<Article>(repository)

// Default populate to fetch related author/category/blocks/seo unless overridden.
export const createArticleService = withDefaults<Article>(createBaseArticleService, {
  populate: [
    ArticlePopulate.Author,
    ArticlePopulate.Category,
    ArticlePopulate.Blocks,
    ArticlePopulate.Cover,
  ],
})
