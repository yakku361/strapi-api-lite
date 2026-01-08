import { createCollectionService, withDefaults } from './collection-service.js';
const createBaseCategoryService = (repository) => createCollectionService(repository);
export const createCategoryService = withDefaults(createBaseCategoryService, {});
//# sourceMappingURL=category-service.js.map