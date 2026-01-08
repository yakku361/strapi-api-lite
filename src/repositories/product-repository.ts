import type { Product } from '../models/product.js'
import type { CollectionRepository, HttpClient } from './contracts.js'
import { createCollectionRepository } from './collection-repository.js'
import { CollectionName } from './collections.js'

export type ProductRepository = CollectionRepository<Product>

export const createProductRepository = (
  client: HttpClient,
  collectionName: CollectionName | string = CollectionName.Product
): ProductRepository => createCollectionRepository<Product>(collectionName, client)
