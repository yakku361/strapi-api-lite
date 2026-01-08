import { createCollectionRepository } from './collection-repository.js';
import { CollectionName } from './collections.js';
export const createArticleRepository = (client, collectionName = CollectionName.Article) => createCollectionRepository(collectionName, client);
//# sourceMappingURL=article-repository.js.map