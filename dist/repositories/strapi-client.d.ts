import type { HttpClient, RepositoryQuery } from './contracts.js';
export declare const createStrapiClient: (apiBase: string) => HttpClient;
export declare const mergeFilters: (query: RepositoryQuery | undefined, filters: Record<string, unknown>) => RepositoryQuery;
//# sourceMappingURL=strapi-client.d.ts.map