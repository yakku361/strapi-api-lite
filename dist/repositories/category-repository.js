import { createCollectionRepository } from './collection-repository.js';
import { CollectionName } from './collections.js';
export const createCategoryRepository = (client, collectionName = CollectionName.Category) => createCollectionRepository(collectionName, client);
//# sourceMappingURL=category-repository.js.map