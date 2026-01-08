import type { StrapiCollectionResponse, StrapiRestCollection, StrapiRestSingle, StrapiSingleResponse } from '../repositories/contracts.js';
export declare const normalizeCollectionResponse: <T>(input: StrapiCollectionResponse<T> | StrapiRestCollection<T> | any) => StrapiCollectionResponse<T>;
export declare const normalizeSingleResponse: <T>(input: StrapiSingleResponse<T> | StrapiRestSingle<T> | any) => StrapiSingleResponse<T>;
//# sourceMappingURL=normalize.d.ts.map