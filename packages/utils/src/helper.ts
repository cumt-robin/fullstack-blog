import { getType, isArray, isDefined } from "./type";

type PlainObject<K extends string | number | symbol = string, V = unknown> = Record<K, V>;

export function requestParamsFilter(obj: PlainObject, isArrayToString = false): PlainObject {
    if (isArray(obj)) {
        return obj;
    }
    if (getType(obj) !== "object") {
        return {};
    }
    const newObj: PlainObject = {};
    Object.keys(obj).forEach((key) => {
        const element = obj[key];
        if (Array.isArray(element)) {
            if (element.length > 0) {
                newObj[key] = isArrayToString ? element.join(",") : [...element];
            }
        } else if (isDefined(element)) {
            newObj[key] = element;
        }
    });
    return newObj;
}
