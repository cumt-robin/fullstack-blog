/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestOptions } from "~/utils/request/type";
import { TOKEN_TYPE } from "~/utils/request/const";
import merge from "lodash/merge";
import type { NormalResponse, Response } from "~/types/xhr/response";
import type { PlainObject } from "~/types/base";
import { requestParamsFilter } from "~/utils/request/filter";
import { getApiBase } from "~/utils/request/api-base";
import { isFunction } from "~/utils/type";

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

export default defineNuxtPlugin((nuxtApp) => {
    const { runWithContext } = useNuxtApp();
    const authStore = useAuthStore();
    const { token } = storeToRefs(authStore);

    const handleTokenInvalid = () => {
        runWithContext(() => {
            authStore.clearSession();
            navigateTo("/login", { redirectCode: 302 });
        });
    };

    const xhrRequest = async <T extends Response>(url: string, opts?: any): Promise<T> => {
        const BASE_OPTIONS: Partial<RequestOptions> = {
            baseURL: getApiBase(),
            headers: {
                appId: import.meta.env.VITE_APP_ID as string,
            },
            enableEncodeSearchParams: true,
            toastError: true,
            onRequest: async ({ request, options }) => {
                if (options.params) {
                    options.params = isFunction(options.paramsFormatter)
                        ? options.paramsFormatter(options.params)
                        : requestParamsFilter(options.params, {
                              isArrayToString: true,
                              encode: options.enableEncodeSearchParams,
                              encodeMethod: options.paramsEncodeMethod,
                          });
                }

                if (token.value) {
                    options.headers.set("Authorization", `${TOKEN_TYPE} ${token.value}`);
                }
            },
        };
        const _options = merge({}, BASE_OPTIONS, opts);
        const data = (await $fetch<T>(url, _options)) as T;
        if (data.code === "0") {
            // 文件流，直接返回；success 为 true，代表成功
            return data;
        }

        switch (data.code) {
            // 需要重新登录
            case InnerCode.Unauthorized:
            case InnerCode.TokenExpired:
            case InnerCode.Forbidden:
                handleTokenInvalid();
                break;
            default:
                if (!_options || _options.toastError !== false) {
                    showErrorMsgByResponse(data);
                }
                break;
        }
        return Promise.reject(data);
    };

    const getApi = <T extends Response>(url: string, params: PlainObject = {}, options: RequestOptions = {}): Promise<T> => {
        return xhrRequest<T>(url, {
            params,
            ...options,
            method: "GET",
        });
    };

    nuxtApp.provide("getApi", getApi);
});
