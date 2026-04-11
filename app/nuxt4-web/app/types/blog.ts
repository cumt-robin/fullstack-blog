import type { CommonResponse, PlainObject } from "@fullstack-blog/types";

export class BlogApiError<T = unknown> extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly data?: T;

    constructor(message: string, options: { code?: string; statusCode?: number; data?: T } = {}) {
        super(message);
        this.name = "BlogApiError";
        this.code = options.code || "UNKNOWN";
        this.statusCode = options.statusCode || 500;
        this.data = options.data;
    }
}

export interface BlogRequestOptions {
    query?: PlainObject;
    body?: BodyInit | PlainObject | FormData;
    headers?: HeadersInit;
}

export type BlogSessionInvalidHandler = (error: BlogApiError) => void;

export interface BlogApi {
    request<T extends CommonResponse>(path: string, options?: BlogRequestOptions & { method?: string }): Promise<T>;
    get<T extends CommonResponse>(path: string, query?: PlainObject, headers?: HeadersInit): Promise<T>;
    delete<T extends CommonResponse>(path: string, query?: PlainObject, headers?: HeadersInit): Promise<T>;
    post<T extends CommonResponse>(path: string, body?: PlainObject | FormData, headers?: HeadersInit): Promise<T>;
    postJson<T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit): Promise<T>;
    put<T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit): Promise<T>;
    putJson<T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit): Promise<T>;
    patch<T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit): Promise<T>;
    patchJson<T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit): Promise<T>;
}
