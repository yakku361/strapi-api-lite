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

  return {
    get: async <T>(path: string, params?: any) => {
      const query = params ? toQueryString(params) : ''
      const url = query ? `${path}?${query}` : path
      return client<T>(url)
    },
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
