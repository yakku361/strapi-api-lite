import { createCollectionRepository } from './collection-repository.js';
import { CollectionName } from './collections.js';
export const createPageRepository = (client, collectionName = CollectionName.Page) => createCollectionRepository(collectionName, client);
//# sourceMappingURL=page-repository.js.map