import { createCollectionService, withDefaults } from './collection-service.js';
import { ArticlePopulate } from '../constants/populate.js';
const createBaseArticleService = (repository) => createCollectionService(repository);
// Default populate to fetch related author/category/blocks/seo unless overridden.
export const createArticleService = withDefaults(createBaseArticleService, {
    populate: [
        ArticlePopulate.Author,
        ArticlePopulate.Category,
        ArticlePopulate.Blocks,
        ArticlePopulate.Cover,
    ],
});
//# sourceMappingURL=article-service.js.map