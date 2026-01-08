import type { CollectionRepository, RepositoryQuery, StrapiPopulate } from '../repositories/contracts.js'
import type { CollectionService, CollectionServiceFactory } from './contracts.js'

// Generic service builder: composes a repository and exposes semantic method names.
export const createCollectionService = <T>(
  repository: CollectionRepository<T>
): CollectionService<T> => ({
  list: (query?: RepositoryQuery) => repository.findAll(query),
  getById: (id: string | number, query?: RepositoryQuery) => repository.findOneById(id, query),
  getBySlug: (slug: string, query?: RepositoryQuery) => repository.findOneBySlug(slug, query),
})

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const mergeFiltersDeep = (
  defaults: Record<string, unknown> | undefined,
  overrides: Record<string, unknown> | undefined
): Record<string, unknown> | undefined => {
  if (!overrides) return defaults
  if (!defaults) return overrides
  if (!isPlainObject(defaults) || !isPlainObject(overrides)) return overrides

  const result: Record<string, unknown> = { ...defaults }
  for (const [key, value] of Object.entries(overrides)) {
    if (isPlainObject(value) && isPlainObject(defaults[key])) {
      result[key] = mergeFiltersDeep(defaults[key] as Record<string, unknown>, value)
    } else {
      result[key] = value
    }
  }
  return result
}

const toPopulateArray = (populate?: StrapiPopulate): string[] => {
  if (!populate) return []
  if (populate === '*') return ['*']
  return Array.isArray(populate) ? populate : [populate]
}

const mergePopulate = (
  defaults: StrapiPopulate | undefined,
  overrides: StrapiPopulate | undefined
): StrapiPopulate | undefined => {
  if (overrides === undefined) return defaults
  if (overrides === '*') return '*'
  if (defaults === '*') return '*'

  const overrideArray = toPopulateArray(overrides)
  if (overrideArray.length === 0) return []

  const merged = Array.from(new Set([...toPopulateArray(defaults), ...overrideArray]))
  return merged
}

const mergeQueries = (defaults: RepositoryQuery, query?: RepositoryQuery): RepositoryQuery => {
  if (!query) return defaults

  const mergedPopulate = mergePopulate(defaults.populate, query.populate)
  const mergedFilters = mergeFiltersDeep(
    defaults.filters as Record<string, unknown> | undefined,
    query.filters as Record<string, unknown> | undefined
  )

  return {
    ...defaults,
    ...query,
    populate: mergedPopulate,
    filters: mergedFilters,
  }
}

export const withDefaults = <T>(
  factory: CollectionServiceFactory<T>,
  defaults: RepositoryQuery
): CollectionServiceFactory<T> => (repository) => {
  const service = factory(repository)

  return {
    list: (query) => service.list(mergeQueries(defaults, query)),
    getById: (id, query) => service.getById(id, mergeQueries(defaults, query)),
    getBySlug: (slug, query) => service.getBySlug(slug, mergeQueries(defaults, query)),
  }
}
