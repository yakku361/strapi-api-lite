# strapi-rest-lite

TypeScript-SDK (ESM) für Strapi v4 REST: flache, typisierte Responses, fertige Repositories/Services für Artikel, Kategorien, Pages, Produkte und generische Helfer für eigene Collections.

## Was macht das Paket?
- Baut auf Strapi REST v4 auf, nimmt dir das Query-Building ab und normalisiert Responses (`data/attributes`, Relationen, Media) zu flachen Objekten.
- Liefert vorgefertigte Repositories/Services mit sinnvollen Populate-Defaults je Typ.
- Enthält Models/Typen für die Standard-Content-Types und Exports für eigene Typen/Collections.
- Ermöglicht Override von Collection-Slugs, Populate-Defaults und eigener Query-Nutzung.

## Installation

```bash
npm install strapi-rest-lite
# ofetch wird als Dependency mitinstalliert.
```

## Schnellstart

```ts
import { createRepositories, createServices } from 'strapi-rest-lite'

const apiBase = 'https://cms.example.com/api'
const repositories = createRepositories(apiBase)           // Artikel, Kategorien, Pages, Produkte
const services = createServices(repositories)              // mit Populate-Defaults

const article = await services.articleService.getBySlug('hello-world', { locale: 'en' })
console.log(article.data?.title)
```

Eigene Collection-Slugs (wenn dein Strapi andere Routen nutzt):

```ts
import { createRepositories, CollectionName } from 'strapi-rest-lite'

const repositories = createRepositories(apiBase, {
  product: 'shop-products',
  page: CollectionName.Page, // Enum für Defaults
})
```

Populate überschreiben pro Call (statt Defaults):

```ts
await services.articleService.getBySlug('hello-world', { populate: ['author', 'seo'] })
```
Populate-Arrays werden mit den Defaults zusammengeführt (ohne Duplikate); `populate: []` schaltet die Defaults ab.

Eintrag erstellen (POST):

```ts
await services.articleService.create({ title: 'Neu', slug: 'neu' })
// Body wird automatisch als { data: ... } gesendet und Response flach normalisiert.
```

Eintrag aktualisieren (PUT):

```ts
await services.articleService.update(1, { title: 'Aktualisiert' })
```

Eintrag löschen (DELETE):

```ts
await services.articleService.delete(1)
```

## Bausteine

- `createStrapiClient(apiBase)`: `ofetch`-Wrapper mit Query-Serializer.
- `createCollectionRepository(collectionName, httpClient)`: generisches Repo mit `findAll`, `findOneById`, `findOneBySlug`, `create`, `update`, `delete`.
- Vorkonfigurierte Repositories: `createArticleRepository`, `createCategoryRepository`, `createPageRepository`, `createProductRepository`.
- `createRepositories(apiBase, collections?)`: bündelt die Repos, erlaubt Slug-Overrides.
- `CollectionName`-Enum: Default-Slugs (`articles`, `categories`, `pages`, `products`).
- Services: `createCollectionService`, `withDefaults` (mergt Default-Queries inkl. `populate`/`filters`), plus fertige Services für Artikel/Kategorie/Page/Produkt.
- Populate-Enums: `ArticlePopulate`, `PagePopulate`, `ProductPopulate` (für klare Defaults/Overrides).
- Normalizer: `normalizeCollectionResponse`, `normalizeSingleResponse` machen Strapi-REST flach. Media behalten Meta-Felder (url, formats, alt etc.), werden aber zu String gekürzt, wenn nur `url` vorhanden ist.

### Eigene Collection anbinden

```ts
import { createStrapiClient, createCollectionRepository } from 'strapi-rest-lite'

type FAQ = { id: number; question: string; answer: string }

const client = createStrapiClient('https://cms.example.com/api')
const faqRepository = createCollectionRepository<FAQ>('faqs', client)

const faqs = await faqRepository.findAll({ locale: 'de', populate: ['seo'] })
```

## Queries (RepositoryQuery)

Unterstützt Strapi-Standardparameter:
- `populate`: `'*'` oder Feldnamen/Arrays (siehe Populate-Enums).
- `filters`: beliebige Filter-Objekte (werden korrekt zu Querystring serialisiert).
- `sort`, `fields`, `pagination`, `locale`, weitere Schlüssel möglich.

`mergeFilters(query, filters)` hilft, zusätzliche Filter mit bestehenden zu kombinieren (z. B. Slug).

## Strapi-Schema (erforderliche Felder)

Damit die SDK-Typen ohne zusätzliches Mapping funktionieren, sollten die Content-Types in Strapi so aussehen (die SDK normalisiert `data/attributes` automatisch):

- **Article (`articles`)**
  - Felder: `title`, `description`, `slug` (UID), `cover` (Media → URL), `blocks` (Dynamic Zone/Component mit `body` o. ä.), `seo` (Component mit `metaTitle`, `metaDescription`, `shareImage`/`metaImage`), optional `documentId`.
  - Relationen: `author`, `category`.
  - Erwartet flach: `cover` als URL oder Media-Objekt, `blocks` als Array `{ __component, id?, body? }`, `seo` flach.

- **Page (`pages`)**
  - Felder: `title`, `description?`, `slug` (UID), `primarypage` (Boolean), `dynamic` (DZ, z. B. `shared.rich-text`, `shared.seo`), `seo`.
  - DZ als Array mit `__component`, `id` etc.

- **Category (`categories`)**: `name`, `slug` (UID), `description?`, optional `documentId`.
- **Author (`authors`)**: `name`, `email?`, `avatar?` (Media → URL/Objekt), optional `documentId`.
- **Product (`products`)**: `title`, `slug` (UID), `description?`, `price?`, `sku?`, `cover?` (Media → URL/Objekt), optional `documentId`.

### Populate-Defaults der Services
- Article: `author`, `category`, `blocks`, `cover` (SEO kannst du bei Bedarf in der Query mitgeben)
- Page: `dynamic` (SEO separat popuplaten, falls vorhanden)
- Product: `cover`
- Category: keine Defaults
Diese Defaults kannst du pro Call überschreiben.

## Build / Release

```bash
npm run build            # erzeugt dist/ mit ESM + .d.ts
npm pack                 # optional zum Prüfen des Tarballs
# Publish: npm publish --access public --otp <code>
```

Das Paket ist ESM-only (`"type": "module"`, `moduleResolution: NodeNext`) und exportiert den Root-Eintragspunkt über `exports`.
