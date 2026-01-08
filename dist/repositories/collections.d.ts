export declare enum CollectionName {
    Article = "articles",
    Category = "categories",
    Page = "pages",
    Product = "products"
}
export declare const defaultCollections: {
    readonly article: CollectionName.Article;
    readonly category: CollectionName.Category;
    readonly page: CollectionName.Page;
    readonly product: CollectionName.Product;
};
export type CollectionKey = keyof typeof defaultCollections;
//# sourceMappingURL=collections.d.ts.map