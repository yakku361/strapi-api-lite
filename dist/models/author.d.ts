import type { Media } from './media.js';
export interface Author {
    id: number;
    documentId?: string;
    name: string;
    email?: string | null;
    avatar?: string | Media | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
//# sourceMappingURL=author.d.ts.map