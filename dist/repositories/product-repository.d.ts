import type { Product } from '../models/product.js';
import type { CollectionRepository, HttpClient } from './contracts.js';
import { CollectionName } from './collections.js';
export type ProductRepository = CollectionRepository<Product>;
export declare const createProductRepository: (client: HttpClient, collectionName?: CollectionName | string) => ProductRepository;
//# sourceMappingURL=product-repository.d.ts.map