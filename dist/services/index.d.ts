import type { createRepositories } from '../repositories/index.js';
export declare const createServices: (repositories: ReturnType<typeof createRepositories>) => {
    articleService: import("./contracts.js").CollectionService<import("../index.js").Article>;
    categoryService: import("./contracts.js").CollectionService<import("../index.js").Category>;
    pageService: import("./contracts.js").CollectionService<import("../index.js").Page>;
    productService: import("./contracts.js").CollectionService<import("../index.js").Product>;
};
export type Services = ReturnType<typeof createServices>;
//# sourceMappingURL=index.d.ts.map