import type { FetchOptions } from "ofetch";
import type { PlainObject } from "~/types/base";

export type EncodeMethod = "encodeURI" | "encodeURIComponent" | "encodeExcludeColon";

export type RequestOptions = FetchOptions & {
    enableEncodeSearchParams?: boolean;
    paramsEncodeMethod?: EncodeMethod;
    paramsFormatter?: (params: PlainObject) => PlainObject;
    toastError?: boolean;
};
