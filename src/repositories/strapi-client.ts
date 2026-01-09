import { ofetch } from 'ofetch'
import type { HttpClient, RepositoryQuery } from './contracts.js'

export const createStrapiClient = (apiBase: string): HttpClient => {
  const client = ofetch.create({ baseURL: apiBase })

  const toQueryString = (value: any, prefix?: string): string => {
    if (value === null || value === undefined) return ''

    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value)
        .map(([key, val]) => toQueryString(val, prefix ? `${prefix}[${key}]` : key))
        .filter(Boolean)
        .join('&')
    }

    if (Array.isArray(value)) {
      return value
        .map((val, index) => toQueryString(val, prefix ? `${prefix}[${index}]` : String(index)))
        .filter(Boolean)
        .join('&')
    }

    return `${encodeURIComponent(prefix ?? '')}=${encodeURIComponent(String(value))}`
  }

  const buildUrl = (path: string, params?: RepositoryQuery): string => {
    const query = params ? toQueryString(params) : ''
    return query ? `${path}?${query}` : path
  }

  return {
    get: async <T>(path: string, params?: RepositoryQuery) => client<T>(buildUrl(path, params)),
    post: async <T>(path: string, body: unknown, params?: RepositoryQuery) =>
      client<T>(buildUrl(path, params), { method: 'POST', body: body as any }),
    put: async <T>(path: string, body: unknown, params?: RepositoryQuery) =>
      client<T>(buildUrl(path, params), { method: 'PUT', body: body as any }),
    delete: async <T>(path: string, params?: RepositoryQuery) =>
      client<T>(buildUrl(path, params), { method: 'DELETE' }),
  }
}

export const mergeFilters = (
  query: RepositoryQuery | undefined,
  filters: Record<string, unknown>
): RepositoryQuery => ({
  ...(query ?? {}),
  filters: {
    ...(query?.filters ?? {}),
    ...filters,
  },
})
