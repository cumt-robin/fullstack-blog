/* eslint-disable @typescript-eslint/no-explicit-any */
type IndexType = string | number | symbol;

export type PlainObject<K extends IndexType = string, V = unknown> = Record<K, V>;

export type GeneralFunction<T = unknown> = (...args: any[]) => T;

export interface RecordDTO extends PlainObject {
    id: number;
}
