import { describe, expect, it } from 'vitest'
import { normalizeCollectionResponse, normalizeSingleResponse } from '../src/utils/normalize.js'

describe('normalizeCollectionResponse', () => {
  it('flattens entities, relations and media meta', () => {
    const response = {
      data: [
        {
          id: 1,
          attributes: {
            title: 'Hello',
            cover: { data: { id: 5, attributes: { url: '/img.jpg', alternativeText: 'Alt' } } },
            author: { data: { id: 10, attributes: { name: 'Jane', email: null } } },
          },
        },
      ],
      meta: { pagination: { total: 1 } },
    }

    const normalized = normalizeCollectionResponse<any>(response)

    expect(normalized).toEqual({
      data: [
        {
          id: 1,
          title: 'Hello',
          cover: { id: 5, url: '/img.jpg', alternativeText: 'Alt' },
          author: { id: 10, name: 'Jane', email: null },
        },
      ],
      meta: { pagination: { total: 1 } },
    })
  })
})

describe('normalizeSingleResponse', () => {
  it('returns string for media when only url exists', () => {
    const response = {
      data: {
        id: 3,
        attributes: {
          title: 'Post',
          cover: { data: { id: 11, attributes: { url: '/cover.png' } } },
        },
      },
    }

    const normalized = normalizeSingleResponse<any>(response)

    expect(normalized).toEqual({
      data: { id: 3, title: 'Post', cover: { id: 11, url: '/cover.png' } },
      meta: {},
    })
  })

  it('handles null data gracefully', () => {
    const normalized = normalizeSingleResponse<any>({ data: null, meta: { pagination: { total: 0 } } })

    expect(normalized).toEqual({ data: null, meta: { pagination: { total: 0 } } })
  })
})
