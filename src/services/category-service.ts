import type { Category } from '../models/category.js'
import type { CollectionRepository } from '../repositories/contracts.js'
import { createCollectionService, withDefaults } from './collection-service.js'

const createBaseCategoryService = (repository: CollectionRepository<Category>) =>
  createCollectionService<Category>(repository)

export const createCategoryService = withDefaults<Category>(createBaseCategoryService, {})
