import type { Article } from '../models/article.js'
import type { CollectionRepository, HttpClient } from './contracts.js'
import { createCollectionRepository } from './collection-repository.js'
import { CollectionName } from './collections.js'

export type ArticleRepository = CollectionRepository<Article>

export const createArticleRepository = (
  client: HttpClient,
  collectionName: CollectionName | string = CollectionName.Article
): ArticleRepository => createCollectionRepository<Article>(collectionName, client)
