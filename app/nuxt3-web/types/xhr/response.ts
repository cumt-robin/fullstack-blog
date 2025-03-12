import type { PlainObject, RecordDTO } from "../base";

export interface BaseResponse<T = unknown> {
    code: string;
    extra?: PlainObject | null;
    msg?: string;
    data?: T | T[];
}

export interface ArrayResponse<T extends PlainObject = RecordDTO> extends BaseResponse {
    data: T[];
}

export interface PageResponse<T extends PlainObject = RecordDTO> extends BaseResponse {
    data: T[];
    total: number;
}

export interface RecordResponse<T extends PlainObject = RecordDTO> extends BaseResponse {
    data: T;
}

export interface PlainResponse<T> extends BaseResponse {
    data: T;
}

export type NormalResponse<T = unknown> = T extends PlainObject ? ArrayResponse<T> | PageResponse<T> | RecordResponse<T> : PlainResponse<T>;

export type Response<T = unknown> = NormalResponse<T>;
