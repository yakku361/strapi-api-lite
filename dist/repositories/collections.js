// Central place for default Strapi collection slugs.
export var CollectionName;
(function (CollectionName) {
    CollectionName["Article"] = "articles";
    CollectionName["Category"] = "categories";
    CollectionName["Page"] = "pages";
    CollectionName["Product"] = "products";
})(CollectionName || (CollectionName = {}));
export const defaultCollections = {
    article: CollectionName.Article,
    category: CollectionName.Category,
    page: CollectionName.Page,
    product: CollectionName.Product,
};
//# sourceMappingURL=collections.js.map