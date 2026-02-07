/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
import axios from "axios";
import qs from "qs";

enum InnerCode {
    Unauthorized = "000001",
    TokenExpired = "000002",
    Forbidden = "000003",
}

export const api = axios.create({
    timeout: 20000,
});

type UseAxiosOptions = {
    baseURL?: string;
    onSessionInvalid?: () => void;
    onResponseError?: (error: any) => void;
    onErrorMsg?: (msg: string) => void;
};

export const useAxios = (options?: UseAxiosOptions) => {
    const { baseURL, onSessionInvalid, onResponseError, onErrorMsg } = options || {};
    if (baseURL) {
        api.defaults.baseURL = baseURL;
    }
    // axios初始化配置
    api.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
    api.defaults.transformRequest = (data) => {
        return qs.stringify(data, { encode: true });
    };
    api.defaults.withCredentials = true;

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // 返回状态拦截
    api.interceptors.response.use(
        (response) => {
            const res = response.data;
            const { code, msg } = res;
            if (code === "0") {
                // code 为 0 代表返回正常返回
                return Promise.resolve(res);
            }
            // inner code handler
            switch (code) {
                case InnerCode.Unauthorized:
                case InnerCode.TokenExpired:
                case InnerCode.Forbidden:
                    onSessionInvalid?.();
                    break;
                default:
                    break;
            }
            if (msg) {
                onErrorMsg?.(msg);
            }
            return Promise.reject(res);
        },
        (error) => {
            console.error(error.response);
            if (error.toString().indexOf("timeout") !== -1) {
                // 超时
                onErrorMsg?.("网络请求超时，请检查网络连接！");
            } else if (error.response) {
                switch (error.response.status) {
                    // http status handler
                    case 400: // 客户端请求有误
                        onErrorMsg?.("客户端请求有误，请联系管理员！");
                        break;
                    case 401: // 未授权
                        onErrorMsg?.("未授权，请联系管理员！");
                        break;
                    case 403: // 禁止访问
                        onErrorMsg?.("禁止访问！");
                        break;
                    case 404: // 找不到
                        onErrorMsg?.("访问的资源不存在，请稍后重试！");
                        break;
                    case 502: // bad gateway
                    case 503: // service unavailable
                    case 504: // gateway timeout
                        onErrorMsg?.("服务器维护中，请稍后重试！");
                        break;
                    case 500: // 服务器内部错误
                    default:
                        const errmsg = error.response.data.message;
                        if (errmsg) {
                            onErrorMsg?.(errmsg);
                        } else {
                            onErrorMsg?.("系统内部错误！");
                        }
                        break;
                }
                onResponseError?.(error);
            }
            return Promise.reject(error.response);
        },
    );

    return api;
};
