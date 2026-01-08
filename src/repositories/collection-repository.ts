import type {
  CollectionRepository,
  HttpClient,
  RepositoryQuery,
  StrapiRestCollection,
  StrapiRestSingle,
} from './contracts.js'
import { mergeFilters } from './strapi-client.js'
import { normalizeCollectionResponse, normalizeSingleResponse } from '../utils/normalize.js'

/**
 * Erstellt ein Repository für eine Strapi-Collection.
 * Dieses Repository kapselt alle API-Aufrufe für eine bestimmte Daten-Collection.
 */
export function createCollectionRepository<T>(
  collectionName: string,
  http: HttpClient
): CollectionRepository<T> {
  const baseUrl = `/${collectionName}`

  return {
    async findAll(query?: RepositoryQuery) {
      const response = await http.get<StrapiRestCollection<T>>(baseUrl, query)
      return normalizeCollectionResponse<T>(response)
    },

    async findOneById(id: number | string, query?: RepositoryQuery) {
      const url = `${baseUrl}/${id}`
      const response = await http.get<StrapiRestSingle<T>>(url, query)
      return normalizeSingleResponse<T>(response)
    },

    async findOneBySlug(slug: string, query?: RepositoryQuery) {
      const finalQuery = mergeFilters(query, {
        slug: { $eq: slug },
      })

      const result = await http.get<StrapiRestCollection<T>>(baseUrl, finalQuery)
      const normalized = normalizeCollectionResponse<T>(result)

      // Strapi gibt ein Array zurück
      return {
        data: normalized.data[0] ?? null,
        meta: normalized.meta,
      }
    },
  }
}
