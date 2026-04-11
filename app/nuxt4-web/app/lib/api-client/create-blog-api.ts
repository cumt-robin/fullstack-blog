import { requestParamsFilter } from "@fullstack-blog/utils";
import type { CommonResponse, PlainObject } from "@fullstack-blog/types";
import { BlogApiError, type BlogApi, type BlogRequestOptions, type BlogSessionInvalidHandler } from "~/types/blog";
import type { H3Event$Fetch } from "nitropack/types";

const SESSION_INVALID_CODES = new Set(["000001", "000002", "000004"]);

const isFormData = (value: unknown): value is FormData => {
    return typeof FormData !== "undefined" && value instanceof FormData;
};

export const createBlogApi = (options: {
    baseURL: string;
    onSessionInvalid?: BlogSessionInvalidHandler;
    /** SSR: pass `useRequestFetch()` so inbound cookies reach `/api`. Client: omit to use global `$fetch`. */
    fetcher?: H3Event$Fetch | typeof $fetch;
}) => {
    const rootFetch = options.fetcher ?? $fetch;

    // Create a unified raw request function
    const makeRawRequest = async <T>(path: string, opts: Record<string, unknown>) => {
        // Check if rootFetch has create method (i.e., it's $fetch)
        if (typeof (rootFetch as unknown as any).create === "function") {
            const fetcher = (rootFetch as unknown as any).create({
                baseURL: options.baseURL,
                credentials: "include",
                timeout: 20_000,
            });
            // Cast to any to avoid type issues with raw method
            return (fetcher.raw as any)(path, opts) as Promise<{ _data: T; status: number }>;
        } else {
            // For fetchers without create method (like useRequestFetch in Nuxt 4)
            const response = await rootFetch(path, {
                ...opts,
                baseURL: options.baseURL,
                credentials: "include",
                timeout: 20_000,
                responseType: "json",
            });
            return {
                _data: response as T,
                status: 200, // Assume success for simplicity
            };
        }
    };

    const request = async <T extends CommonResponse>(
        path: string,
        requestOptions: BlogRequestOptions & { method?: string } = {},
    ): Promise<T> => {
        const method = requestOptions.method || "GET";
        const body = requestOptions.body;
        const headers = new Headers(requestOptions.headers || {});
        const query = requestOptions.query ? (requestParamsFilter(requestOptions.query, true) as PlainObject) : undefined;

        let payload = body;
        if (body && !isFormData(body) && method !== "GET" && method !== "DELETE") {
            const filteredBody = requestParamsFilter(body);
            payload = Array.isArray(filteredBody) ? JSON.stringify(filteredBody) : filteredBody;
            if (!headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
        }

        const response = await makeRawRequest<T>(path, {
            method,
            query,
            body: payload,
            headers,
            ignoreResponseError: true,
        });

        const data = response._data;
        if (!data) {
            throw new BlogApiError("Empty response from server", { statusCode: response.status });
        }

        if (response.status >= 400) {
            throw new BlogApiError(data.msg || "Request failed", {
                statusCode: response.status,
                code: data.code,
                data,
            });
        }

        if (data.code !== "0") {
            const error = new BlogApiError(data.msg || "Request failed", {
                statusCode: response.status,
                code: data.code,
                data,
            });
            if (SESSION_INVALID_CODES.has(data.code)) {
                options.onSessionInvalid?.(error);
            }
            throw error;
        }

        return data;
    };

    const api: BlogApi = {
        request,
        get: <T extends CommonResponse>(path: string, query?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "GET", query, headers }),
        delete: <T extends CommonResponse>(path: string, query?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "DELETE", query, headers }),
        post: <T extends CommonResponse>(path: string, body?: PlainObject | FormData, headers?: HeadersInit) =>
            request<T>(path, { method: "POST", body, headers }),
        postJson: <T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "POST", body, headers: { "Content-Type": "application/json", ...(headers || {}) } }),
        put: <T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "PUT", body, headers }),
        putJson: <T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "PUT", body, headers: { "Content-Type": "application/json", ...(headers || {}) } }),
        patch: <T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "PATCH", body, headers }),
        patchJson: <T extends CommonResponse>(path: string, body?: PlainObject, headers?: HeadersInit) =>
            request<T>(path, { method: "PATCH", body, headers: { "Content-Type": "application/json", ...(headers || {}) } }),
    };

    return api;
};
