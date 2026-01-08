import { CollectionName, type CollectionKey } from './collections.js';
export type CollectionConfig = Partial<Record<CollectionKey, CollectionName | string>>;
export declare const createRepositories: (apiBase: string, collections?: CollectionConfig) => {
    articleRepository: import("./article-repository.js").ArticleRepository;
    categoryRepository: import("./category-repository.js").CategoryRepository;
    pageRepository: import("./page-repository.js").PageRepository;
    productRepository: import("./product-repository.js").ProductRepository;
};
export type Repositories = ReturnType<typeof createRepositories>;
//# sourceMappingURL=index.d.ts.map