/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EncodeMethod } from "~/utils/request/type";

declare module "ofetch" {
    interface ResolvedFetchOptions {
        paramsFormatter: (params: Record<string, any>) => any;
        enableEncodeSearchParams: boolean;
        paramsEncodeMethod: EncodeMethod;
        toastError?: boolean;
    }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
