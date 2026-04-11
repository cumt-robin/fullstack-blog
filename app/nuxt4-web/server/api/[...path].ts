import { appendResponseHeader, getQuery, getRequestHeaders, getRouterParam, readRawBody, setResponseStatus } from "h3";

const RESPONSE_HEADERS_TO_FORWARD = new Set(["content-type"]);

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const pathParam = getRouterParam(event, "path");
    const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam || "";
    const target = new URL(path, `${runtimeConfig.apiTarget.replace(/\/$/, "")}/`);
    const query = new URLSearchParams();

    Object.entries(getQuery(event)).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => query.append(key, String(item)));
            return;
        }
        if (value !== undefined) {
            query.set(key, String(value));
        }
    });

    target.search = query.toString();

    const method = event.method;
    const headers = { ...getRequestHeaders(event) };
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];

    const body = method === "GET" || method === "HEAD" ? undefined : await readRawBody(event, false);
    const response = await $fetch.raw(target.toString(), {
        method,
        headers,
        body,
        ignoreResponseError: true,
    });

    setResponseStatus(event, response.status, response.statusText);

    const setCookies = response.headers.getSetCookie?.() || [];
    setCookies.forEach((value) => appendResponseHeader(event, "set-cookie", value));

    response.headers.forEach((value, key) => {
        if (RESPONSE_HEADERS_TO_FORWARD.has(key.toLowerCase())) {
            appendResponseHeader(event, key, value);
        }
    });

    return response._data;
});
