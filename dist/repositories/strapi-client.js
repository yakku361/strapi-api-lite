import { ofetch } from 'ofetch';
export const createStrapiClient = (apiBase) => {
    const client = ofetch.create({ baseURL: apiBase });
    const toQueryString = (value, prefix) => {
        if (value === null || value === undefined)
            return '';
        if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.entries(value)
                .map(([key, val]) => toQueryString(val, prefix ? `${prefix}[${key}]` : key))
                .filter(Boolean)
                .join('&');
        }
        if (Array.isArray(value)) {
            return value
                .map((val, index) => toQueryString(val, prefix ? `${prefix}[${index}]` : String(index)))
                .filter(Boolean)
                .join('&');
        }
        return `${encodeURIComponent(prefix ?? '')}=${encodeURIComponent(String(value))}`;
    };
    const buildUrl = (path, params) => {
        const query = params ? toQueryString(params) : '';
        return query ? `${path}?${query}` : path;
    };
    return {
        get: async (path, params) => client(buildUrl(path, params)),
        post: async (path, body, params) => client(buildUrl(path, params), { method: 'POST', body: body }),
        put: async (path, body, params) => client(buildUrl(path, params), { method: 'PUT', body: body }),
        delete: async (path, params) => client(buildUrl(path, params), { method: 'DELETE' }),
    };
};
export const mergeFilters = (query, filters) => ({
    ...(query ?? {}),
    filters: {
        ...(query?.filters ?? {}),
        ...filters,
    },
});
//# sourceMappingURL=strapi-client.js.map