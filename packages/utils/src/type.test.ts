import {
    getType,
    isDefined,
    isObject,
    isArray,
    isNumber,
    isString,
    isBool,
    isUndefined,
    isNull,
    isUndefOrNull,
    isFunction,
    isSymbol,
    isMap,
    isSet,
    isPromise,
    isFile,
    isBlob,
    isBasicType,
} from "./type";

describe("type", () => {
    describe("getType", () => {
        test('should return "number" for number', () => {
            expect(getType(123)).toBe("number");
            expect(getType(0)).toBe("number");
            expect(getType(-1)).toBe("number");
            expect(getType(1.5)).toBe("number");
            expect(getType(NaN)).toBe("number");
            expect(getType(Infinity)).toBe("number");
        });

        test('should return "string" for string', () => {
            expect(getType("hello")).toBe("string");
            expect(getType("")).toBe("string");
        });

        test('should return "boolean" for boolean', () => {
            expect(getType(true)).toBe("boolean");
            expect(getType(false)).toBe("boolean");
        });

        test('should return "undefined" for undefined', () => {
            expect(getType(undefined)).toBe("undefined");
        });

        test('should return "null" for null', () => {
            expect(getType(null)).toBe("null");
        });

        test('should return "object" for object', () => {
            expect(getType({})).toBe("object");
            expect(getType({ key: "value" })).toBe("object");
        });

        test('should return "array" for array', () => {
            expect(getType([])).toBe("array");
            expect(getType([1, 2, 3])).toBe("array");
        });

        test('should return "function" for function', () => {
            expect(getType(() => {})).toBe("function");
            expect(getType(() => {})).toBe("function");
        });

        test('should return "symbol" for symbol', () => {
            expect(getType(Symbol("test"))).toBe("symbol");
        });

        test('should return "date" for date', () => {
            expect(getType(new Date())).toBe("date");
        });

        test('should return "map" for map', () => {
            expect(getType(new Map())).toBe("map");
        });

        test('should return "set" for set', () => {
            expect(getType(new Set())).toBe("set");
        });

        test('should return "promise" for promise', () => {
            expect(getType(Promise.resolve())).toBe("promise");
        });

        test('should return "bigint" for bigint', () => {
            expect(getType(BigInt(123))).toBe("bigint");
        });
    });

    describe("isDefined", () => {
        test("should return true for defined values", () => {
            expect(isDefined(0)).toBe(true);
            expect(isDefined("hello")).toBe(true);
            expect(isDefined(false)).toBe(true);
            expect(isDefined({})).toBe(true);
            expect(isDefined([])).toBe(true);
        });

        test("should return false for null", () => {
            expect(isDefined(null)).toBe(false);
        });

        test("should return false for undefined", () => {
            expect(isDefined(undefined)).toBe(false);
        });

        test("should return false for empty string", () => {
            expect(isDefined("")).toBe(false);
        });
    });

    describe("isObject", () => {
        test("should return true for plain objects", () => {
            expect(isObject({})).toBe(true);
            expect(isObject({ key: "value" })).toBe(true);
            expect(isObject({ a: 1, b: 2 })).toBe(true);
        });

        test("should return false for non-objects", () => {
            expect(isObject(null)).toBe(false);
            expect(isObject(undefined)).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject("string")).toBe(false);
            expect(isObject(true)).toBe(false);
            expect(isObject([])).toBe(false);
            expect(isObject(() => {})).toBe(false);
        });
    });

    describe("isArray", () => {
        test("should return true for arrays", () => {
            expect(isArray([])).toBe(true);
            expect(isArray([1, 2, 3])).toBe(true);
            expect(isArray(["a", "b", "c"])).toBe(true);
            expect(isArray([{}])).toBe(true);
        });

        test("should return false for non-arrays", () => {
            expect(isArray({})).toBe(false);
            expect(isArray(null)).toBe(false);
            expect(isArray(undefined)).toBe(false);
            expect(isArray(123)).toBe(false);
            expect(isArray("string")).toBe(false);
            expect(isArray(true)).toBe(false);
        });
    });

    describe("isNumber", () => {
        test("should return true for numbers", () => {
            expect(isNumber(123)).toBe(true);
            expect(isNumber(0)).toBe(true);
            expect(isNumber(-1)).toBe(true);
            expect(isNumber(1.5)).toBe(true);
        });

        test("should return true for NaN", () => {
            expect(isNumber(NaN)).toBe(true);
        });

        test("should return true for Infinity", () => {
            expect(isNumber(Infinity)).toBe(true);
        });

        test("should return false for non-numbers", () => {
            expect(isNumber("123")).toBe(false);
            expect(isNumber(null)).toBe(false);
            expect(isNumber(undefined)).toBe(false);
            expect(isNumber({})).toBe(false);
            expect(isNumber([])).toBe(false);
        });
    });

    describe("isString", () => {
        test("should return true for strings", () => {
            expect(isString("hello")).toBe(true);
            expect(isString("")).toBe(true);
            expect(isString("123")).toBe(true);
        });

        test("should return false for non-strings", () => {
            expect(isString(123)).toBe(false);
            expect(isString(null)).toBe(false);
            expect(isString(undefined)).toBe(false);
            expect(isString({})).toBe(false);
            expect(isString([])).toBe(false);
            expect(isString(true)).toBe(false);
        });
    });

    describe("isBool", () => {
        test("should return true for booleans", () => {
            expect(isBool(true)).toBe(true);
            expect(isBool(false)).toBe(true);
        });

        test("should return false for non-booleans", () => {
            expect(isBool(1)).toBe(false);
            expect(isBool(0)).toBe(false);
            expect(isBool("true")).toBe(false);
            expect(isBool(null)).toBe(false);
            expect(isBool(undefined)).toBe(false);
        });
    });

    describe("isUndefined", () => {
        test("should return true for undefined", () => {
            expect(isUndefined(undefined)).toBe(true);
            // eslint-disable-next-line no-void
            expect(isUndefined(void 0)).toBe(true);
        });

        test("should return false for non-undefined", () => {
            expect(isUndefined(null)).toBe(false);
            expect(isUndefined(0)).toBe(false);
            expect(isUndefined("")).toBe(false);
            expect(isUndefined(false)).toBe(false);
        });
    });

    describe("isNull", () => {
        test("should return true for null", () => {
            expect(isNull(null)).toBe(true);
        });

        test("should return false for non-null", () => {
            expect(isNull(undefined)).toBe(false);
            expect(isNull(0)).toBe(false);
            expect(isNull("")).toBe(false);
        });
    });

    describe("isUndefOrNull", () => {
        test("should return true for undefined", () => {
            expect(isUndefOrNull(undefined)).toBe(true);
        });

        test("should return true for null", () => {
            expect(isUndefOrNull(null)).toBe(true);
        });

        test("should return false for defined non-null values", () => {
            expect(isUndefOrNull(0)).toBe(false);
            expect(isUndefOrNull("")).toBe(false);
            expect(isUndefOrNull(false)).toBe(false);
            expect(isUndefOrNull({})).toBe(false);
        });
    });

    describe("isFunction", () => {
        test("should return true for functions", () => {
            expect(isFunction(() => {})).toBe(true);
            expect(isFunction(() => {})).toBe(true);
        });

        test("should return false for non-functions", () => {
            expect(isFunction({})).toBe(false);
            expect(isFunction([])).toBe(false);
            expect(isFunction(123)).toBe(false);
            expect(isFunction("string")).toBe(false);
        });
    });

    describe("isSymbol", () => {
        test("should return true for symbols", () => {
            expect(isSymbol(Symbol("test"))).toBe(true);
            // eslint-disable-next-line symbol-description
            expect(isSymbol(Symbol())).toBe(true);
        });

        test("should return false for non-symbols", () => {
            expect(isSymbol("symbol")).toBe(false);
            expect(isSymbol(123)).toBe(false);
            expect(isSymbol({})).toBe(false);
        });
    });

    describe("isMap", () => {
        test("should return true for maps", () => {
            expect(isMap(new Map())).toBe(true);
            expect(isMap(new Map([["key", "value"]]))).toBe(true);
        });

        test("should return false for non-maps", () => {
            expect(isMap({})).toBe(false);
            expect(isMap([])).toBe(false);
            expect(isMap(new Set())).toBe(false);
        });
    });

    describe("isSet", () => {
        test("should return true for sets", () => {
            expect(isSet(new Set())).toBe(true);
            expect(isSet(new Set([1, 2, 3]))).toBe(true);
        });

        test("should return false for non-sets", () => {
            expect(isSet({})).toBe(false);
            expect(isSet([])).toBe(false);
            expect(isSet(new Map())).toBe(false);
        });
    });

    describe("isPromise", () => {
        test("should return true for promises", () => {
            expect(isPromise(Promise.resolve())).toBe(true);
            const rejectedPromise = Promise.reject();
            rejectedPromise.catch(() => {});
            expect(isPromise(rejectedPromise)).toBe(true);
            expect(isPromise(new Promise(() => {}))).toBe(true);
        });

        test("should return false for non-promises", () => {
            expect(isPromise({})).toBe(false);
            expect(isPromise([])).toBe(false);
            expect(isPromise(() => {})).toBe(false);
        });
    });

    describe("isFile", () => {
        test("should return false for non-files", () => {
            expect(isFile({})).toBe(false);
            expect(isFile([])).toBe(false);
            expect(isFile("file.txt")).toBe(false);
        });
    });

    describe("isBlob", () => {
        test("should return false for non-blobs", () => {
            expect(isBlob({})).toBe(false);
            expect(isBlob([])).toBe(false);
            expect(isBlob("content")).toBe(false);
        });
    });

    describe("isBasicType", () => {
        test("should return true for number", () => {
            expect(isBasicType(123)).toBe(true);
            expect(isBasicType(0)).toBe(true);
            expect(isBasicType(-1)).toBe(true);
        });

        test("should return true for string", () => {
            expect(isBasicType("hello")).toBe(true);
            expect(isBasicType("")).toBe(true);
        });

        test("should return true for boolean", () => {
            expect(isBasicType(true)).toBe(true);
            expect(isBasicType(false)).toBe(true);
        });

        test("should return true for symbol", () => {
            expect(isBasicType(Symbol("test"))).toBe(true);
        });

        test("should return true for undefined", () => {
            expect(isBasicType(undefined)).toBe(true);
        });

        test("should return true for null", () => {
            expect(isBasicType(null)).toBe(true);
        });

        test("should return false for object", () => {
            expect(isBasicType({})).toBe(false);
            expect(isBasicType({ key: "value" })).toBe(false);
        });

        test("should return false for array", () => {
            expect(isBasicType([])).toBe(false);
            expect(isBasicType([1, 2, 3])).toBe(false);
        });

        test("should return false for function", () => {
            expect(isBasicType(() => {})).toBe(false);
        });

        test("should return false for date", () => {
            expect(isBasicType(new Date())).toBe(false);
        });

        test("should return false for map", () => {
            expect(isBasicType(new Map())).toBe(false);
        });

        test("should return false for set", () => {
            expect(isBasicType(new Set())).toBe(false);
        });

        test("should return false for promise", () => {
            expect(isBasicType(Promise.resolve())).toBe(false);
        });

        test("should return false for bigint", () => {
            expect(isBasicType(BigInt(123))).toBe(false);
        });
    });
});
