import type { Category } from '../models/category.js';
import type { CollectionRepository, HttpClient } from './contracts.js';
import { CollectionName } from './collections.js';
export type CategoryRepository = CollectionRepository<Category>;
export declare const createCategoryRepository: (client: HttpClient, collectionName?: CollectionName | string) => CategoryRepository;
//# sourceMappingURL=category-repository.d.ts.map