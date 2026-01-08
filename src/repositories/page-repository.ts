import type { Page } from '../models/page.js'
import type { CollectionRepository, HttpClient } from './contracts.js'
import { createCollectionRepository } from './collection-repository.js'
import { CollectionName } from './collections.js'

export type PageRepository = CollectionRepository<Page>

export const createPageRepository = (
  client: HttpClient,
  collectionName: CollectionName | string = CollectionName.Page
): PageRepository => createCollectionRepository<Page>(collectionName, client)
