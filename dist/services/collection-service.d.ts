import type { CollectionRepository, RepositoryQuery } from '../repositories/contracts.js';
import type { CollectionService, CollectionServiceFactory } from './contracts.js';
export declare const createCollectionService: <T>(repository: CollectionRepository<T>) => CollectionService<T>;
export declare const withDefaults: <T>(factory: CollectionServiceFactory<T>, defaults: RepositoryQuery) => CollectionServiceFactory<T>;
//# sourceMappingURL=collection-service.d.ts.map