import { createArticleService } from './article-service.js';
import { createCategoryService } from './category-service.js';
import { createPageService } from './page-service.js';
import { createProductService } from './product-service.js';
export const createServices = (repositories) => ({
    articleService: createArticleService(repositories.articleRepository),
    categoryService: createCategoryService(repositories.categoryRepository),
    pageService: createPageService(repositories.pageRepository),
    productService: createProductService(repositories.productRepository),
});
//# sourceMappingURL=index.js.map