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
