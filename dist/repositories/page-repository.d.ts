import type { Page } from '../models/page.js';
import type { CollectionRepository, HttpClient } from './contracts.js';
import { CollectionName } from './collections.js';
export type PageRepository = CollectionRepository<Page>;
export declare const createPageRepository: (client: HttpClient, collectionName?: CollectionName | string) => PageRepository;
//# sourceMappingURL=page-repository.d.ts.map