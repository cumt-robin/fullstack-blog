/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetch } from "#app";
import merge from "lodash/merge";
import { createError } from "nuxt/app";
import type { PlainObject } from "~/types/base";
import type { NormalResponse } from "~/types/xhr/response";
import { getApiBase } from "~/utils/request/api-base";
import { TOKEN_TYPE } from "~/utils/request/const";
import { requestParamsFilter } from "~/utils/request/filter";

enum InnerCode {
    Unauthorized = "000001",
    TokenExpired = "000002",
    Forbidden = "000003",
}

function showErrorMsgByResponse(data: NormalResponse): void {
    // if (!import.meta.env.SSR) {
    //     // 只在客户端提示
    //     const msg = codeMessage[data.code as InnerCode] || data.message;
    //     if (msg) {
    //         message.error(msg);
    //     }
    // }
}

const defaultOptions = {
    baseURL: getApiBase(),
    headers: {
        appId: import.meta.env.VITE_APP_ID as string,
    },
};

export const useApiFetch = async (url: string, options: any = {}) => {
    const authStore = useAuthStore();
    const token = useCookie("token").value;
    const _options = merge(
        {
            headers: {
                Authorization: token ? `${TOKEN_TYPE} ${token}` : "",
            },
            params: requestParamsFilter(options.params as PlainObject, {
                isArrayToString: true,
                encode: true,
            }),
        },
        defaultOptions,
        options,
    );

    return await useFetch(`${getApiBase()}${url}`, {
        key: url,
        ..._options,
        onResponse: async ({ response }) => {
            if (response.status === 200 && response._data) {
                const { code } = response._data;

                if (code === "0") {
                    return;
                }

                switch (code) {
                    // 需要重新登录
                    case InnerCode.Unauthorized:
                    case InnerCode.TokenExpired:
                    case InnerCode.Forbidden:
                        authStore.clearSession();
                        navigateTo("/login", { redirectCode: 302 });
                        throw createError({
                            status: response.status,
                            statusText: response?._data?.message || "登录失效",
                        });
                    default:
                        if (!_options || _options.toastError !== false) {
                            showErrorMsgByResponse(response._data);
                        }
                        throw createError({
                            status: response.status,
                            statusText: response?._data?.message || "出错了",
                        });
                }
            } else {
                throw createError({
                    status: response.status,
                    statusText: response.statusText,
                });
            }
        },
        onResponseError({ response }) {
            throw createError({
                status: response.status,
                statusText: response.statusText,
            });
        },
    });
};

export const useGet = async (url: string, params: PlainObject = {}, options = {}) => {
    return await useApiFetch(url, { method: "GET", params, ...options });
};

export const usePost = async (url: string, body: any, options = {}) => {
    return await useApiFetch(url, { method: "POST", body, ...options });
};
