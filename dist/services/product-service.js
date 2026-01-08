import { createCollectionService, withDefaults } from './collection-service.js';
import { ProductPopulate } from '../constants/populate.js';
const createBaseProductService = (repository) => createCollectionService(repository);
export const createProductService = withDefaults(createBaseProductService, {
    populate: [ProductPopulate.Cover],
});
//# sourceMappingURL=product-service.js.map