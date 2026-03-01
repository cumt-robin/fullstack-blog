import { getType, isArray, isDefined } from "./type";

type PlainObject<K extends string | number | symbol = string, V = unknown> = Record<K, V>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requestParamsFilter(obj: any, isArrayToString = false): Array<any> | PlainObject<string, any> {
    if (isArray(obj)) {
        return obj;
    }
    if (getType(obj) !== "object") {
        return {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: PlainObject<string, any> = {};
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
