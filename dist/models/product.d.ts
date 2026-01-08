import type { Media } from './media.js';
export interface Product {
    id: number;
    documentId?: string;
    title: string;
    slug: string;
    description?: string | null;
    price?: number | null;
    sku?: string | null;
    cover?: string | Media | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
//# sourceMappingURL=product.d.ts.map