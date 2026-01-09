const normalizeValue = (value) => {
    if (value === null || value === undefined)
        return value;
    if (Array.isArray(value)) {
        return value.map(normalizeValue);
    }
    if (typeof value !== 'object') {
        return value;
    }
    // Relations/Media: { data: ... }
    if ('data' in value) {
        return normalizeValue(value.data);
    }
    // Strapi entity: { id, attributes }
    if ('attributes' in value && 'id' in value) {
        const { id, attributes, ...rest } = value;
        const normalizedAttributes = normalizeValue(attributes);
        const normalizedRest = normalizeObject(rest);
        if (normalizedAttributes === null || typeof normalizedAttributes !== 'object' || Array.isArray(normalizedAttributes)) {
            const fallbackAttributes = attributes && typeof attributes === 'object' && !Array.isArray(attributes)
                ? normalizeObject(attributes)
                : { attributes: normalizedAttributes };
            return normalizeValue({ id, ...fallbackAttributes, ...normalizedRest });
        }
        return normalizeValue({ id, ...normalizedAttributes, ...normalizedRest });
    }
    // Media objects: prefer url if present
    if ('url' in value) {
        const { url, ...rest } = value;
        const normalizedRest = normalizeObject(rest);
        const hasAdditionalFields = Object.keys(normalizedRest).length > 0;
        // If only url exists, keep the previous convenience of returning a string.
        if (!hasAdditionalFields && typeof url === 'string') {
            return url;
        }
        return { url: url ?? null, ...normalizedRest };
    }
    return normalizeObject(value);
};
const normalizeObject = (obj) => Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, normalizeValue(val)]));
export const normalizeCollectionResponse = (input) => {
    const data = Array.isArray(input?.data) ? input.data.map((item) => normalizeValue(item)) : [];
    return { data, meta: input?.meta ?? {} };
};
export const normalizeSingleResponse = (input) => {
    const entity = normalizeValue(input?.data ?? null);
    return { data: entity, meta: input?.meta ?? {} };
};
//# sourceMappingURL=normalize.js.map