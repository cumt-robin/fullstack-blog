import { requestParamsFilter } from "./helper";

describe("helper", () => {
    describe("requestParamsFilter", () => {
        test("should return empty object for non-object input", () => {
            expect(requestParamsFilter(null)).toEqual({});
            expect(requestParamsFilter(undefined)).toEqual({});
            expect(requestParamsFilter("string")).toEqual({});
            expect(requestParamsFilter(123)).toEqual({});
            expect(requestParamsFilter(true)).toEqual({});
        });

        test("should return array input as is", () => {
            const arr = [1, 2, 3];
            expect(requestParamsFilter(arr)).toBe(arr);
        });

        test("should filter out undefined values", () => {
            const obj = {
                name: "test",
                age: undefined,
                city: "beijing",
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({ name: "test", city: "beijing" });
        });

        test("should filter out null values", () => {
            const obj = {
                name: "test",
                age: null,
                city: "beijing",
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({ name: "test", city: "beijing" });
        });

        test("should filter out empty string values", () => {
            const obj = {
                name: "test",
                age: "",
                city: "beijing",
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({ name: "test", city: "beijing" });
        });

        test("should keep valid values", () => {
            const obj = {
                name: "test",
                age: 25,
                city: "beijing",
                active: true,
                zero: 0,
                false: false,
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                age: 25,
                city: "beijing",
                active: true,
                zero: 0,
                false: false,
            });
        });

        test("should handle empty arrays", () => {
            const obj = {
                name: "test",
                tags: [],
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({ name: "test" });
        });

        test("should keep non-empty arrays by default", () => {
            const obj = {
                name: "test",
                tags: ["tag1", "tag2", "tag3"],
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                tags: ["tag1", "tag2", "tag3"],
            });
        });

        test("should convert arrays to string when isArrayToString is true", () => {
            const obj = {
                name: "test",
                tags: ["tag1", "tag2", "tag3"],
            };
            const result = requestParamsFilter(obj, true);
            expect(result).toEqual({
                name: "test",
                tags: "tag1,tag2,tag3",
            });
        });

        test("should handle mixed object with arrays and primitive values", () => {
            const obj = {
                name: "test",
                age: 25,
                tags: ["tag1", "tag2"],
                emptyTags: [],
                emptyString: "",
                nullValue: null,
                undefinedValue: undefined,
                active: true,
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                age: 25,
                tags: ["tag1", "tag2"],
                active: true,
            });
        });

        test("should handle nested objects", () => {
            const obj = {
                name: "test",
                nested: {
                    value: "nested",
                },
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                nested: {
                    value: "nested",
                },
            });
        });

        test("should handle array with single element", () => {
            const obj = {
                name: "test",
                tags: ["single"],
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                tags: ["single"],
            });
        });

        test("should handle array with numbers", () => {
            const obj = {
                name: "test",
                ids: [1, 2, 3],
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                name: "test",
                ids: [1, 2, 3],
            });
        });

        test("should convert number array to string when isArrayToString is true", () => {
            const obj = {
                name: "test",
                ids: [1, 2, 3],
            };
            const result = requestParamsFilter(obj, true);
            expect(result).toEqual({
                name: "test",
                ids: "1,2,3",
            });
        });

        test("should handle empty object", () => {
            const obj = {};
            const result = requestParamsFilter(obj);
            expect(result).toEqual({});
        });

        test("should handle object with only undefined/null/empty values", () => {
            const obj = {
                undefinedValue: undefined,
                nullValue: null,
                emptyString: "",
                emptyArray: [],
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({});
        });

        test("should preserve original object structure", () => {
            const obj = {
                name: "test",
                age: 25,
                city: "beijing",
            };
            const result = requestParamsFilter(obj);
            expect(Object.keys(result)).toEqual(["name", "age", "city"]);
        });

        test("should handle special number values", () => {
            const obj = {
                zero: 0,
                negative: -1,
                float: 1.5,
                nan: NaN,
                infinity: Infinity,
            };
            const result = requestParamsFilter(obj);
            expect(result).toEqual({
                zero: 0,
                negative: -1,
                float: 1.5,
                nan: NaN,
                infinity: Infinity,
            });
        });
    });
});
