import type { Page } from '../models/page.js'
import type { CollectionRepository } from '../repositories/contracts.js'
import { createCollectionService, withDefaults } from './collection-service.js'
import { PagePopulate } from '../constants/populate.js'

const createBasePageService = (repository: CollectionRepository<Page>) =>
  createCollectionService<Page>(repository)

export const createPageService = withDefaults<Page>(createBasePageService, {
  populate: [PagePopulate.Dynamic],
})
