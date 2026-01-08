import type { CollectionRepository, HttpClient } from './contracts.js';
/**
 * Erstellt ein Repository für eine Strapi-Collection.
 * Dieses Repository kapselt alle API-Aufrufe für eine bestimmte Daten-Collection.
 */
export declare function createCollectionRepository<T>(collectionName: string, http: HttpClient): CollectionRepository<T>;
//# sourceMappingURL=collection-repository.d.ts.map