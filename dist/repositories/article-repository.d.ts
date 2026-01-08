import type { Article } from '../models/article.js';
import type { CollectionRepository, HttpClient } from './contracts.js';
import { CollectionName } from './collections.js';
export type ArticleRepository = CollectionRepository<Article>;
export declare const createArticleRepository: (client: HttpClient, collectionName?: CollectionName | string) => ArticleRepository;
//# sourceMappingURL=article-repository.d.ts.map