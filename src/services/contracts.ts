import type {
  CollectionRepository,
  RepositoryQuery,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '../repositories/contracts.js'

export interface CollectionService<T> {
  list(query?: RepositoryQuery): Promise<StrapiCollectionResponse<T>>
  getById(id: string | number, query?: RepositoryQuery): Promise<StrapiSingleResponse<T>>
  getBySlug(slug: string, query?: RepositoryQuery): Promise<StrapiSingleResponse<T>>
}

export interface CollectionServiceFactory<T> {
  (repository: CollectionRepository<T>): CollectionService<T>
}
