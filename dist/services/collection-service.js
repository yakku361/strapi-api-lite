// Generic service builder: composes a repository and exposes semantic method names.
export const createCollectionService = (repository) => ({
    list: (query) => repository.findAll(query),
    getById: (id, query) => repository.findOneById(id, query),
    getBySlug: (slug, query) => repository.findOneBySlug(slug, query),
});
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const mergeFiltersDeep = (defaults, overrides) => {
    if (!overrides)
        return defaults;
    if (!defaults)
        return overrides;
    if (!isPlainObject(defaults) || !isPlainObject(overrides))
        return overrides;
    const result = { ...defaults };
    for (const [key, value] of Object.entries(overrides)) {
        if (isPlainObject(value) && isPlainObject(defaults[key])) {
            result[key] = mergeFiltersDeep(defaults[key], value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
};
const toPopulateArray = (populate) => {
    if (!populate)
        return [];
    if (populate === '*')
        return ['*'];
    return Array.isArray(populate) ? populate : [populate];
};
const mergePopulate = (defaults, overrides) => {
    if (overrides === undefined)
        return defaults;
    if (overrides === '*')
        return '*';
    if (defaults === '*')
        return '*';
    const overrideArray = toPopulateArray(overrides);
    if (overrideArray.length === 0)
        return [];
    const merged = Array.from(new Set([...toPopulateArray(defaults), ...overrideArray]));
    return merged;
};
const mergeQueries = (defaults, query) => {
    if (!query)
        return defaults;
    const mergedPopulate = mergePopulate(defaults.populate, query.populate);
    const mergedFilters = mergeFiltersDeep(defaults.filters, query.filters);
    return {
        ...defaults,
        ...query,
        populate: mergedPopulate,
        filters: mergedFilters,
    };
};
export const withDefaults = (factory, defaults) => (repository) => {
    const service = factory(repository);
    return {
        list: (query) => service.list(mergeQueries(defaults, query)),
        getById: (id, query) => service.getById(id, mergeQueries(defaults, query)),
        getBySlug: (slug, query) => service.getBySlug(slug, mergeQueries(defaults, query)),
    };
};
//# sourceMappingURL=collection-service.js.map