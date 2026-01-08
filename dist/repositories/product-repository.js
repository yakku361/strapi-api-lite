import { createCollectionRepository } from './collection-repository.js';
import { CollectionName } from './collections.js';
export const createProductRepository = (client, collectionName = CollectionName.Product) => createCollectionRepository(collectionName, client);
//# sourceMappingURL=product-repository.js.map