import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStrapiClient, mergeFilters } from '../src/repositories/strapi-client.js'

const { createSpy } = vi.hoisted(() => ({
  createSpy: vi.fn(),
}))

vi.mock('ofetch', () => ({ ofetch: { create: createSpy } }))

describe('createStrapiClient', () => {
  beforeEach(() => {
    createSpy.mockReset()
  })

  it('serializes objects and arrays into querystring', async () => {
    const captured: string[] = []
    createSpy.mockReturnValue(async (url: string) => {
      captured.push(url)
      return { ok: true }
    })

    const apiBase = 'https://cms.example.com/api'
    const client = createStrapiClient(apiBase)

    await client.get('/articles', {
      populate: ['author', 'seo'],
      filters: { slug: { $eq: 'hello-world' } },
    })

    expect(createSpy).toHaveBeenCalledWith({ baseURL: apiBase })
    const url = new URL(`http://dummy${captured[0]}`)
    expect(url.pathname).toBe('/articles')
    expect(url.searchParams.get('populate[0]')).toBe('author')
    expect(url.searchParams.get('populate[1]')).toBe('seo')
    expect(url.searchParams.get('filters[slug][$eq]')).toBe('hello-world')
  })

  it('omits querystring when no params are provided', async () => {
    createSpy.mockReturnValue(async (url: string) => url)
    const client = createStrapiClient('https://cms.example.com/api')

    const result = await client.get('/categories')

    expect(result).toBe('/categories')
  })

  it('sends POST with body and serializes params', async () => {
    const requestMock = vi.fn()
    createSpy.mockReturnValue(requestMock)
    const client = createStrapiClient('https://cms.example.com/api')

    await client.post('/articles', { data: { title: 'Hello' } }, { populate: ['author'] })

    expect(requestMock).toHaveBeenCalledTimes(1)
    const [url, options] = requestMock.mock.calls[0] as [string, Record<string, unknown>]
    const parsed = new URL(`http://dummy${url}`)

    expect(parsed.pathname).toBe('/articles')
    expect(parsed.searchParams.get('populate[0]')).toBe('author')
    expect(options).toEqual({
      method: 'POST',
      body: { data: { title: 'Hello' } },
    })
  })

  it('sends PUT with body and serializes params', async () => {
    const requestMock = vi.fn()
    createSpy.mockReturnValue(requestMock)
    const client = createStrapiClient('https://cms.example.com/api')

    await client.put('/articles/5', { data: { title: 'Updated' } }, { locale: 'de' })

    expect(requestMock).toHaveBeenCalledTimes(1)
    const [url, options] = requestMock.mock.calls[0] as [string, Record<string, unknown>]
    const parsed = new URL(`http://dummy${url}`)

    expect(parsed.pathname).toBe('/articles/5')
    expect(parsed.searchParams.get('locale')).toBe('de')
    expect(options).toEqual({
      method: 'PUT',
      body: { data: { title: 'Updated' } },
    })
  })

  it('sends DELETE and serializes params', async () => {
    const requestMock = vi.fn()
    createSpy.mockReturnValue(requestMock)
    const client = createStrapiClient('https://cms.example.com/api')

    await client.delete('/articles/6', { locale: 'fr' })

    expect(requestMock).toHaveBeenCalledTimes(1)
    const [url, options] = requestMock.mock.calls[0] as [string, Record<string, unknown>]
    const parsed = new URL(`http://dummy${url}`)

    expect(parsed.pathname).toBe('/articles/6')
    expect(parsed.searchParams.get('locale')).toBe('fr')
    expect(options).toEqual({ method: 'DELETE' })
  })
})

describe('mergeFilters', () => {
  it('merges existing filters with additional ones', () => {
    const merged = mergeFilters(
      { populate: ['author'], filters: { locale: { $eq: 'de' } } },
      { slug: { $eq: 'hello' } }
    )

    expect(merged).toEqual({
      populate: ['author'],
      filters: { locale: { $eq: 'de' }, slug: { $eq: 'hello' } },
    })
  })
})
