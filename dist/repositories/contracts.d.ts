export type StrapiRequestPath = string;
export interface StrapiPagination {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
}
export interface StrapiMeta {
    pagination?: StrapiPagination;
}
export interface StrapiCollectionResponse<T> {
    data: T[];
    meta: StrapiMeta;
}
export interface StrapiSingleResponse<T> {
    data: T | null;
    meta?: StrapiMeta;
}
export type StrapiPopulate = '*' | string | string[];
export interface StrapiRestEntity<T> {
    id: number | string;
    attributes: T;
    [key: string]: unknown;
}
export interface StrapiRestCollection<T> {
    data: Array<StrapiRestEntity<T>>;
    meta: StrapiMeta;
}
export interface StrapiRestSingle<T> {
    data: StrapiRestEntity<T> | null;
    meta?: StrapiMeta;
}
export interface RepositoryQuery {
    populate?: StrapiPopulate;
    sort?: string | string[];
    fields?: string[];
    filters?: Record<string, unknown>;
    pagination?: StrapiPagination;
    locale?: string;
    [key: string]: unknown;
}
export interface HttpClient {
    get<T>(path: StrapiRequestPath, params?: RepositoryQuery): Promise<T>;
}
export interface CollectionRepository<T> {
    findAll(query?: RepositoryQuery): Promise<StrapiCollectionResponse<T>>;
    findOneById(id: string | number, query?: RepositoryQuery): Promise<StrapiSingleResponse<T>>;
    findOneBySlug(slug: string, query?: RepositoryQuery): Promise<StrapiSingleResponse<T>>;
}
//# sourceMappingURL=contracts.d.ts.map