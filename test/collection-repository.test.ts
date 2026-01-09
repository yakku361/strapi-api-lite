import { describe, expect, it, vi } from 'vitest'
import { createCollectionRepository } from '../src/repositories/collection-repository.js'
import type {
  HttpClient,
  RepositoryQuery,
  StrapiRestCollection,
  StrapiRestSingle,
} from '../src/repositories/contracts.js'

const createHttpClient = (
  getResult: any,
  postResult: any = getResult,
  putResult: any = getResult,
  deleteResult: any = getResult
) => {
  const get = vi.fn(async (_path: string, _query?: RepositoryQuery) => getResult)
  const post = vi.fn(async (_path: string, _body: unknown, _query?: RepositoryQuery) => postResult)
  const put = vi.fn(async (_path: string, _body: unknown, _query?: RepositoryQuery) => putResult)
  const del = vi.fn(async (_path: string, _query?: RepositoryQuery) => deleteResult)
  return { get, post, put, delete: del } as HttpClient
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

  it('creates an entry and normalizes the response', async () => {
    const apiResponse: StrapiRestSingle<{ title: string }> = {
      data: {
        id: 3,
        attributes: { title: 'New article' },
      },
      meta: {},
    }
    const http = createHttpClient(undefined, apiResponse)
    const repository = createCollectionRepository<{ title: string }>('articles', http)

    const result = await repository.create({ title: 'New article' }, { populate: ['author'] })

    expect(http.post).toHaveBeenCalledWith(
      '/articles',
      { data: { title: 'New article' } },
      { populate: ['author'] }
    )
    expect(result).toEqual({ data: { id: 3, title: 'New article' }, meta: {} })
  })

  it('updates an entry and normalizes the response', async () => {
    const apiResponse: StrapiRestSingle<{ title: string }> = {
      data: {
        id: 4,
        attributes: { title: 'Updated article' },
      },
      meta: {},
    }
    const http = createHttpClient(undefined, undefined, apiResponse)
    const repository = createCollectionRepository<{ title: string }>('articles', http)

    const result = await repository.update(4, { title: 'Updated article' }, { populate: ['author'] })

    expect(http.put).toHaveBeenCalledWith(
      '/articles/4',
      { data: { title: 'Updated article' } },
      { populate: ['author'] }
    )
    expect(result).toEqual({ data: { id: 4, title: 'Updated article' }, meta: {} })
  })

  it('deletes an entry and normalizes the response', async () => {
    const apiResponse: StrapiRestSingle<{ title: string }> = {
      data: {
        id: 5,
        attributes: { title: 'Deleted article' },
      },
      meta: {},
    }
    const http = createHttpClient(undefined, undefined, undefined, apiResponse)
    const repository = createCollectionRepository<{ title: string }>('articles', http)

    const result = await repository.delete(5, { locale: 'de' })

    expect(http.delete).toHaveBeenCalledWith('/articles/5', { locale: 'de' })
    expect(result).toEqual({ data: { id: 5, title: 'Deleted article' }, meta: {} })
  })
})
