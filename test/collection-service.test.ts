import { describe, expect, it, vi } from 'vitest'
import { createCollectionService, withDefaults } from '../src/services/collection-service.js'
import type { CollectionRepository } from '../src/repositories/contracts.js'

const createRepository = () =>
  ({
    findAll: vi.fn().mockResolvedValue({ data: [], meta: {} }),
    findOneById: vi.fn().mockResolvedValue({ data: null, meta: {} }),
    findOneBySlug: vi.fn().mockResolvedValue({ data: null, meta: {} }),
  }) as unknown as CollectionRepository<unknown>

describe('withDefaults', () => {
  it('merges populate arrays without duplicates', async () => {
    const repository = createRepository()
    const defaults = { populate: ['author', 'cover'], filters: { published: { $eq: true } } }
    const service = withDefaults(createCollectionService, defaults)(repository)

    await service.list({
      populate: ['seo', 'cover'],
      filters: { locale: { $eq: 'de' } },
      pagination: { page: 2 },
    })

    expect(repository.findAll).toHaveBeenCalledWith({
      populate: ['author', 'cover', 'seo'],
      filters: { published: { $eq: true }, locale: { $eq: 'de' } },
      pagination: { page: 2 },
    })
  })

  it('allows overriding populate with empty array', async () => {
    const repository = createRepository()
    const defaults = { populate: ['author', 'cover'] }
    const service = withDefaults(createCollectionService, defaults)(repository)

    await service.getById(1, { populate: [] })

    expect(repository.findOneById).toHaveBeenCalledWith(1, { populate: [] })
  })

  it('respects populate wildcard and deep merges filters', async () => {
    const repository = createRepository()
    const defaults = { populate: ['author'], filters: { visibility: { $eq: 'public' } } }
    const service = withDefaults(createCollectionService, defaults)(repository)

    await service.getBySlug('hello', {
      populate: '*',
      filters: { visibility: { $eq: 'private' }, locale: { $eq: 'en' } },
    })

    expect(repository.findOneBySlug).toHaveBeenCalledWith('hello', {
      populate: '*',
      filters: { visibility: { $eq: 'private' }, locale: { $eq: 'en' } },
    })
  })
})
