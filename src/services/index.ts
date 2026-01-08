import { createArticleService } from './article-service.js'
import { createCategoryService } from './category-service.js'
import { createPageService } from './page-service.js'
import { createProductService } from './product-service.js'
import type { createRepositories } from '../repositories/index.js'

export const createServices = (repositories: ReturnType<typeof createRepositories>) => ({
  articleService: createArticleService(repositories.articleRepository),
  categoryService: createCategoryService(repositories.categoryRepository),
  pageService: createPageService(repositories.pageRepository),
  productService: createProductService(repositories.productRepository),
})
export type Services = ReturnType<typeof createServices>
