import { mergeFilters } from './strapi-client.js';
import { normalizeCollectionResponse, normalizeSingleResponse } from '../utils/normalize.js';
/**
 * Erstellt ein Repository für eine Strapi-Collection.
 * Dieses Repository kapselt alle API-Aufrufe für eine bestimmte Daten-Collection.
 */
export function createCollectionRepository(collectionName, http) {
    const baseUrl = `/${collectionName}`;
    return {
        async findAll(query) {
            const response = await http.get(baseUrl, query);
            return normalizeCollectionResponse(response);
        },
        async findOneById(id, query) {
            const url = `${baseUrl}/${id}`;
            const response = await http.get(url, query);
            return normalizeSingleResponse(response);
        },
        async findOneBySlug(slug, query) {
            const finalQuery = mergeFilters(query, {
                slug: { $eq: slug },
            });
            const result = await http.get(baseUrl, finalQuery);
            const normalized = normalizeCollectionResponse(result);
            // Strapi gibt ein Array zurück
            return {
                data: normalized.data[0] ?? null,
                meta: normalized.meta,
            };
        },
        async create(payload, query) {
            const response = await http.post(baseUrl, { data: payload }, query);
            return normalizeSingleResponse(response);
        },
        async update(id, payload, query) {
            const url = `${baseUrl}/${id}`;
            const response = await http.put(url, { data: payload }, query);
            return normalizeSingleResponse(response);
        },
        async delete(id, query) {
            const url = `${baseUrl}/${id}`;
            const response = await http.delete(url, query);
            return normalizeSingleResponse(response);
        },
    };
}
//# sourceMappingURL=collection-repository.js.map