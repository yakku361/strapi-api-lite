import type { Product } from '../models/product.js'
import type { CollectionRepository } from '../repositories/contracts.js'
import { createCollectionService, withDefaults } from './collection-service.js'
import { ProductPopulate } from '../constants/populate.js'

const createBaseProductService = (repository: CollectionRepository<Product>) =>
  createCollectionService<Product>(repository)

export const createProductService = withDefaults<Product>(createBaseProductService, {
  populate: [ProductPopulate.Cover],
})
