import type { Category } from '../models/category.js'
import type { CollectionRepository, HttpClient } from './contracts.js'
import { createCollectionRepository } from './collection-repository.js'
import { CollectionName } from './collections.js'

export type CategoryRepository = CollectionRepository<Category>

export const createCategoryRepository = (
  client: HttpClient,
  collectionName: CollectionName | string = CollectionName.Category
): CategoryRepository => createCollectionRepository<Category>(collectionName, client)
