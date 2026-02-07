import { api } from "./request";
import { CommonResponse, PlainObject } from "@fullstack-blog/types";
import { requestParamsFilter } from "@fullstack-blog/utils";

export class ApiService {
    // 特性
    private feature: string;

    constructor(feature: string) {
        this.feature = feature;
    }

    // get请求
    protected $get<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        return api.get(`/${this.feature}/${action}`, {
            ...config,
            params: requestParamsFilter(params, true),
        });
    }

    // delete请求
    protected $del<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        return api.delete(`/${this.feature}/${action}`, {
            ...config,
            params: requestParamsFilter(params, true),
        });
    }

    // delete application/json请求
    protected $delJson<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data: PlainObject) => JSON.stringify(data),
        };
        return api.delete(`/${this.feature}/${action}`, {
            ...defaultConfig,
            ...config,
            data: requestParamsFilter(params),
        });
    }

    // post请求
    protected $post<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        return api.post(`/${this.feature}/${action}`, requestParamsFilter(params), config);
    }

    // post application/json请求
    protected $postJson<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data: PlainObject) => JSON.stringify(data),
        };
        return this.$post(action, params, { ...defaultConfig, ...config });
    }

    // 上传请求，formdata
    protected $upload<T extends CommonResponse>(
        action: string,
        params: FormData = new FormData(),
        config: PlainObject = {
            headers: { "Content-Type": "multipart/form-data" },
            transformRequest: null,
        },
    ): Promise<T> {
        return api.post(`/${this.feature}/${action}`, params, config);
    }

    // put请求
    protected $put<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        return api.put(`/${this.feature}/${action}`, requestParamsFilter(params), config);
    }

    // put application/json请求
    protected $putJson<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data: PlainObject) => JSON.stringify(data),
        };
        return this.$put(action, params, { ...defaultConfig, ...config });
    }

    // patch请求
    protected $patch<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        return api.patch(`/${this.feature}/${action}`, requestParamsFilter(params), config);
    }

    // patch application/json请求
    protected $patchJson<T extends CommonResponse>(action: string, params: PlainObject = {}, config: PlainObject = {}): Promise<T> {
        const defaultConfig = {
            headers: { "Content-Type": "application/json" },
            transformRequest: (data: PlainObject) => JSON.stringify(data),
        };
        return this.$patch(action, params, { ...defaultConfig, ...config });
    }
}
