export interface Media {
    id?: number | string;
    url?: string | null;
    alternativeText?: string | null;
    caption?: string | null;
    formats?: Record<string, unknown>;
    mime?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    [key: string]: unknown;
}
//# sourceMappingURL=media.d.ts.map