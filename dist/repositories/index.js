import { createArticleRepository } from './article-repository.js';
import { createCategoryRepository } from './category-repository.js';
import { createPageRepository } from './page-repository.js';
import { createProductRepository } from './product-repository.js';
import { createStrapiClient } from './strapi-client.js';
import { defaultCollections } from './collections.js';
export const createRepositories = (apiBase, collections = {}) => {
    const client = createStrapiClient(apiBase);
    const names = { ...defaultCollections, ...collections };
    return {
        articleRepository: createArticleRepository(client, names.article),
        categoryRepository: createCategoryRepository(client, names.category),
        pageRepository: createPageRepository(client, names.page),
        productRepository: createProductRepository(client, names.product),
    };
};
//# sourceMappingURL=index.js.map