import { describe, expect, it, vi } from 'vitest'
import { createCollectionRepository } from '../src/repositories/collection-repository.js'
import type { HttpClient, RepositoryQuery, StrapiRestCollection } from '../src/repositories/contracts.js'

const createHttpClient = (result: any) => {
  const get = vi.fn(async (_path: string, _query?: RepositoryQuery) => result)
  return { get } as HttpClient
}

describe('createCollectionRepository', () => {
  it('normalizes collection responses', async () => {
    const apiResponse: StrapiRestCollection<{ title: string }> = {
      data: [
        {
          id: 1,
          attributes: {
            title: 'Hello',
            author: { data: { id: 10, attributes: { name: 'Jane' } } },
          },
        },
      ],
      meta: { pagination: { total: 1 } },
    }
    const http = createHttpClient(apiResponse)
    const repository = createCollectionRepository<{ title: string; author: { id: number; name: string } }>(
      'articles',
      http
    )

    const result = await repository.findAll()

    expect(http.get).toHaveBeenCalledWith('/articles', undefined)
    expect(result).toEqual({
      data: [{ id: 1, title: 'Hello', author: { id: 10, name: 'Jane' } }],
      meta: { pagination: { total: 1 } },
    })
  })

  it('merges slug filters and returns first entry for findOneBySlug', async () => {
    const apiResponse: StrapiRestCollection<{ slug: string }> = {
      data: [
        {
          id: 2,
          attributes: { slug: 'hello' },
        },
      ],
      meta: {},
    }
    const http = createHttpClient(apiResponse)
    const repository = createCollectionRepository<{ slug: string }>('articles', http)

    const result = await repository.findOneBySlug('hello', { filters: { locale: { $eq: 'de' } } })

    expect(http.get).toHaveBeenCalledWith('/articles', {
      filters: { locale: { $eq: 'de' }, slug: { $eq: 'hello' } },
    })
    expect(result).toEqual({ data: { id: 2, slug: 'hello' }, meta: {} })
  })
})
