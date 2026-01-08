import { createCollectionService, withDefaults } from './collection-service.js';
import { PagePopulate } from '../constants/populate.js';
const createBasePageService = (repository) => createCollectionService(repository);
export const createPageService = withDefaults(createBasePageService, {
    populate: [PagePopulate.Dynamic],
});
//# sourceMappingURL=page-service.js.map