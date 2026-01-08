import type {
  StrapiCollectionResponse,
  StrapiRestCollection,
  StrapiRestSingle,
  StrapiSingleResponse,
} from '../repositories/contracts.js'

const normalizeValue = (value: any): any => {
  if (value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value.map(normalizeValue)
  }

  if (typeof value !== 'object') {
    return value
  }

  // Relations/Media: { data: ... }
  if ('data' in value) {
    return normalizeValue((value as { data: unknown }).data)
  }

  // Strapi entity: { id, attributes }
  if ('attributes' in value && 'id' in value) {
    const { id, attributes, ...rest } = value as { id: unknown; attributes: unknown; [k: string]: unknown }
    const normalizedAttributes = normalizeValue(attributes)
    const normalizedRest = normalizeObject(rest)

    if (normalizedAttributes === null || typeof normalizedAttributes !== 'object' || Array.isArray(normalizedAttributes)) {
      const fallbackAttributes =
        attributes && typeof attributes === 'object' && !Array.isArray(attributes)
          ? normalizeObject(attributes as Record<string, unknown>)
          : { attributes: normalizedAttributes }

      return normalizeValue({ id, ...fallbackAttributes, ...normalizedRest })
    }

    return normalizeValue({ id, ...normalizedAttributes, ...normalizedRest })
  }

  // Media objects: prefer url if present
  if ('url' in value) {
    const { url, ...rest } = value as { url?: unknown; [key: string]: unknown }
    const normalizedRest = normalizeObject(rest as Record<string, unknown>)
    const hasAdditionalFields = Object.keys(normalizedRest).length > 0

    // If only url exists, keep the previous convenience of returning a string.
    if (!hasAdditionalFields && typeof url === 'string') {
      return url
    }

    return { url: url ?? null, ...normalizedRest }
  }

  return normalizeObject(value as Record<string, unknown>)
}

const normalizeObject = (obj: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, normalizeValue(val)]))

export const normalizeCollectionResponse = <T>(
  input: StrapiCollectionResponse<T> | StrapiRestCollection<T> | any,
): StrapiCollectionResponse<T> => {
  const data = Array.isArray(input?.data) ? input.data.map((item: any) => normalizeValue(item) as T) : []
  return { data, meta: input?.meta ?? {} }
}

export const normalizeSingleResponse = <T>(
  input: StrapiSingleResponse<T> | StrapiRestSingle<T> | any,
): StrapiSingleResponse<T> => {
  const entity = normalizeValue(input?.data ?? null) as T | null
  return { data: entity, meta: input?.meta ?? {} }
}
