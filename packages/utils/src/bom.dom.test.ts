import { sleep, getLocalData } from "./bom";

describe("bom", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("sleep", () => {
        test("should resolve after specified seconds", async () => {
            const start = Date.now();
            await sleep(0.1);
            const end = Date.now();
            expect(end - start).toBeGreaterThanOrEqual(100);
        });

        test("should resolve immediately with default 0 seconds", async () => {
            const start = Date.now();
            await sleep();
            const end = Date.now();
            expect(end - start).toBeLessThan(100);
        });

        test("should resolve with true value", async () => {
            const result = await sleep(0);
            expect(result).toBe(true);
        });
    });

    describe("getLocalData", () => {
        test("should return string value when parse is false", () => {
            localStorage.setItem("testKey", "testValue");
            const result = getLocalData({ key: "testKey", parse: false });
            expect(result).toBe("testValue");
        });

        test("should return parsed object when parse is true", () => {
            const testObject = { name: "test", value: 123 };
            localStorage.setItem("testKey", JSON.stringify(testObject));
            const result = getLocalData<{ name: string; value: number }>({ key: "testKey", parse: true });
            expect(result).toEqual(testObject);
        });

        test("should return default value when key does not exist", () => {
            const result = getLocalData({ key: "nonExistentKey", defaultValue: "default" });
            expect(result).toBe("default");
        });

        test("should return null when key does not exist and no default value", () => {
            const result = getLocalData({ key: "nonExistentKey" });
            expect(result).toBeNull();
        });

        test("should return parsed null when key exists and value is null string", () => {
            localStorage.setItem("testKey", "null");
            const result = getLocalData({ key: "testKey", parse: true });
            expect(result).toBeNull();
        });

        test("should handle complex object parsing", () => {
            const complexObject = {
                nested: {
                    array: [1, 2, 3],
                    string: "test",
                },
                boolean: true,
                null: null,
            };
            localStorage.setItem("complexKey", JSON.stringify(complexObject));
            const result = getLocalData({ key: "complexKey", parse: true });
            expect(result).toEqual(complexObject);
        });

        test("should handle array parsing", () => {
            const testArray = ["item1", "item2", "item3"];
            localStorage.setItem("arrayKey", JSON.stringify(testArray));
            const result = getLocalData<string[]>({ key: "arrayKey", parse: true });
            expect(result).toEqual(testArray);
        });

        test("should handle number parsing", () => {
            localStorage.setItem("numberKey", "42");
            const result = getLocalData<number>({ key: "numberKey", parse: true });
            expect(result).toBe(42);
        });

        test("should handle boolean parsing", () => {
            localStorage.setItem("booleanKey", "true");
            const result = getLocalData<boolean>({ key: "booleanKey", parse: true });
            expect(result).toBe(true);
        });
    });
});
