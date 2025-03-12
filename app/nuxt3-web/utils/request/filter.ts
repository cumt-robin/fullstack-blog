import type { PlainObject } from "~/types/base";
import { getType, isUndefOrNull } from "../type";
import type { EncodeMethod } from "./type";

interface RequestParamsFilterOptions {
    isArrayToString?: boolean;
    encode?: boolean;
    encodeMethod?: EncodeMethod;
}

/**
 * encodeURIComponent 默认会将英文冒号编码，而某些业务不需要编码冒号
 * @param value
 * @returns
 */
export function encodeExcludeColon(value: string) {
    return value.split(":").map(encodeURIComponent).join(":");
}

/**
 * 处理参数对象
 * @param {Object} obj 参数对象
 * @param {options} isArrayToString 是否需要将数组处理成逗号分隔的string
 * @returns {Object} 处理后的参数对象
 */
export function requestParamsFilter(
    obj: PlainObject,
    { isArrayToString = false, encode = false, encodeMethod = "encodeURIComponent" }: RequestParamsFilterOptions = {},
): PlainObject {
    if (Array.isArray(obj)) {
        return obj;
    } else if (getType(obj) !== "object") {
        return {};
    }
    const newObj = {} as PlainObject;
    const encodeAPI =
        encodeMethod === "encodeURI" ? encodeURI : encodeMethod === "encodeExcludeColon" ? encodeExcludeColon : encodeURIComponent;
    Object.keys(obj).forEach((key) => {
        const element = obj[key];
        if (Array.isArray(element)) {
            if (element.length > 0) {
                newObj[key] = isArrayToString ? (encode ? element.map(encodeAPI).join(",") : element.join(",")) : [...element];
            }
        } else if (!isUndefOrNull(element)) {
            newObj[key] = encode ? encodeAPI(String(element)) : element;
        }
    });
    return newObj;
}
