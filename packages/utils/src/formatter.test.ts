import { approvedFormatter } from "./formatter";

describe("formatter", () => {
    describe("approvedFormatter", () => {
        test('should return "待审核" for value 0', () => {
            expect(approvedFormatter(0)).toBe("待审核");
        });

        test('should return "通过" for value 1', () => {
            expect(approvedFormatter(1)).toBe("通过");
        });

        test('should return "不通过" for value 2', () => {
            expect(approvedFormatter(2)).toBe("不通过");
        });

        test("should handle all valid values", () => {
            const results = [0, 1, 2].map((val) => approvedFormatter(val as 0 | 1 | 2));
            expect(results).toEqual(["待审核", "通过", "不通过"]);
        });
    });
});
