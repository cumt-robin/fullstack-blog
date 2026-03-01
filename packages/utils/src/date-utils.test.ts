/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    initDayjs,
    format,
    getValueOfDate,
    getTime,
    getDateByOffset,
    getTimeInterval,
    getDayStart,
    getDayEnd,
    getOneDayRange,
    isMoreThanOneDay,
    isBefore,
    isSameDay,
    getWeekStart,
    getWeekEnd,
    getOneWeekRange,
    getMonthStart,
    getMonthEnd,
    getOneMonthRange,
    getYearStart,
    getYearEnd,
    getOneYearRange,
    humanizeDuration,
    DATE_STANDARD_FORMAT,
    DATE_STANDARD_FORMAT_CN,
    HOUR_FORMAT,
    ONE_DAY_MILLSECONDS,
    ONE_WEEK_MILLSECONDS,
} from "./date-utils";

describe("date-utils", () => {
    beforeEach(() => {
        initDayjs();
    });

    describe("initDayjs", () => {
        test("should initialize dayjs with Chinese locale", () => {
            expect(() => initDayjs()).not.toThrow();
        });
    });

    describe("constants", () => {
        test("DATE_STANDARD_FORMAT should be correct", () => {
            expect(DATE_STANDARD_FORMAT).toBe("YYYY-MM-DD HH:mm:ss");
        });

        test("DATE_STANDARD_FORMAT_CN should be correct", () => {
            expect(DATE_STANDARD_FORMAT_CN).toBe("YYYY年M月D日 HH:mm:ss");
        });

        test("HOUR_FORMAT should be correct", () => {
            expect(HOUR_FORMAT).toBe("HH:mm:ss");
        });

        test("ONE_DAY_MILLSECONDS should be correct", () => {
            expect(ONE_DAY_MILLSECONDS).toBe(86400000);
        });

        test("ONE_WEEK_MILLSECONDS should be correct", () => {
            expect(ONE_WEEK_MILLSECONDS).toBe(604800000);
        });
    });

    describe("format", () => {
        test("should format date with default format", () => {
            const date = new Date("2023-01-01T12:00:00");
            const result = format(date);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test("should format date with custom format", () => {
            const date = new Date("2023-01-01T12:00:00");
            const result = format(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should format string date", () => {
            const result = format("2023-01-01", "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should format current date when no date provided", () => {
            const result = format();
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });
    });

    describe("getValueOfDate", () => {
        test("should return timestamp of date", () => {
            const date = new Date("2023-01-01T00:00:00");
            const result = getValueOfDate(date);
            expect(typeof result).toBe("number");
            expect(result).toBeGreaterThan(0);
        });

        test("should return timestamp of current date when no date provided", () => {
            const result = getValueOfDate();
            expect(typeof result).toBe("number");
            expect(result).toBeGreaterThan(0);
        });
    });

    describe("getTime", () => {
        test("should return timestamp of date", () => {
            const date = new Date("2023-01-01T00:00:00");
            const result = getTime(date);
            expect(typeof result).toBe("number");
            expect(result).toBeGreaterThan(0);
        });

        test("should return timestamp of current date when no date provided", () => {
            const result = getTime();
            expect(typeof result).toBe("number");
            expect(result).toBeGreaterThan(0);
        });
    });

    describe("getDateByOffset", () => {
        test("should return date with default options", () => {
            const date = new Date("2023-01-01");
            const result = getDateByOffset(date, { offset: 0, unit: "d", format: DATE_STANDARD_FORMAT });
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test("should add days to date", () => {
            const date = new Date("2023-01-01");
            const result = getDateByOffset(date, { offset: 1, unit: "d", format: "YYYY-MM-DD" });
            expect(result).toBe("2023-01-02");
        });

        test("should subtract days from date", () => {
            const date = new Date("2023-01-01");
            const result = getDateByOffset(date, { offset: -1, unit: "d", format: "YYYY-MM-DD" });
            expect(result).toBe("2022-12-31");
        });

        test("should add months to date", () => {
            const date = new Date("2023-01-01");
            const result = getDateByOffset(date, { offset: 1, unit: "M", format: "YYYY-MM-DD" });
            expect(result).toBe("2023-02-01");
        });

        test("should add years to date", () => {
            const date = new Date("2023-01-01");
            const result = getDateByOffset(date, { offset: 1, unit: "y", format: "YYYY-MM-DD" });
            expect(result).toBe("2024-01-01");
        });
    });

    describe("getTimeInterval", () => {
        test("should return time interval in minutes", () => {
            const result = getTimeInterval("2023-01-01 12:00:00", "2023-01-01 13:00:00", "minute");
            expect(result).toBe(60);
        });

        test("should return time interval in hours", () => {
            const result = getTimeInterval("2023-01-01 12:00:00", "2023-01-01 18:00:00", "hour");
            expect(result).toBe(6);
        });

        test("should return time interval in days", () => {
            const result = getTimeInterval("2023-01-01", "2023-01-03", "day");
            expect(result).toBe(2);
        });

        test("should return absolute value of time interval", () => {
            const result1 = getTimeInterval("2023-01-01", "2023-01-02", "day");
            const result2 = getTimeInterval("2023-01-02", "2023-01-01", "day");
            expect(result1).toBe(result2);
        });
    });

    describe("getDayStart", () => {
        test("should return start of day with default format", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayStart(date);
            expect(result).toBe("2023-01-01 00:00:00");
        });

        test("should return start of day with custom format", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayStart(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should return valueOf when format is valueOf", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayStart(date, "valueOf");
            expect(typeof result).toBe("number");
        });

        test("should handle positive offset", () => {
            const date = new Date("2023-01-01");
            const result = getDayStart(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2023-01-02");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-01-01");
            const result = getDayStart(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-12-31");
        });
    });

    describe("getDayEnd", () => {
        test("should return end of day with default format", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayEnd(date);
            expect(result).toBe("2023-01-01 23:59:59");
        });

        test("should return end of day with custom format", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayEnd(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should return valueOf when format is valueOf", () => {
            const date = new Date("2023-01-01T12:30:45");
            const result = getDayEnd(date, "valueOf");
            expect(typeof result).toBe("number");
        });

        test("should handle positive offset", () => {
            const date = new Date("2023-01-01");
            const result = getDayEnd(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2023-01-02");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-01-01");
            const result = getDayEnd(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-12-31");
        });
    });

    describe("getOneDayRange", () => {
        test("should return array of start and end of day", () => {
            const date = new Date("2023-01-01");
            const result = getOneDayRange(date);
            expect(result).toHaveLength(2);
            expect(result[0]).toBe("2023-01-01 00:00:00");
            expect(result[1]).toBe("2023-01-01 23:59:59");
        });

        test("should handle offset", () => {
            const date = new Date("2023-01-01");
            const result = getOneDayRange(date, "YYYY-MM-DD", 1);
            expect(result[0]).toBe("2023-01-02");
            expect(result[1]).toBe("2023-01-02");
        });
    });

    describe("isMoreThanOneDay", () => {
        test("should return true when dates are more than one day apart", () => {
            const date1 = new Date("2023-01-01");
            const date2 = new Date("2023-01-03");
            expect(isMoreThanOneDay(date1, date2)).toBe(true);
        });

        test("should return false when dates are less than one day apart", () => {
            const date1 = new Date("2023-01-01T12:00:00");
            const date2 = new Date("2023-01-01T18:00:00");
            expect(isMoreThanOneDay(date1, date2)).toBe(false);
        });

        test("should return true when dates are exactly one day apart", () => {
            const date1 = new Date("2023-01-01");
            const date2 = new Date("2023-01-02");
            expect(isMoreThanOneDay(date1, date2)).toBe(true);
        });

        test("should handle string dates", () => {
            expect(isMoreThanOneDay("2023-01-01", "2023-01-03")).toBe(true);
        });
    });

    describe("isBefore", () => {
        test("should return true when first date is before second date", () => {
            const date1 = new Date("2023-01-01");
            const date2 = new Date("2023-01-02");
            expect(isBefore(date1, date2)).toBe(true);
        });

        test("should return false when first date is after second date", () => {
            const date1 = new Date("2023-01-02");
            const date2 = new Date("2023-01-01");
            expect(isBefore(date1, date2)).toBe(false);
        });

        test("should return false when dates are equal", () => {
            const date1 = new Date("2023-01-01");
            const date2 = new Date("2023-01-01");
            expect(isBefore(date1, date2)).toBe(false);
        });

        test("should handle string dates", () => {
            expect(isBefore("2023-01-01", "2023-01-02")).toBe(true);
        });
    });

    describe("isSameDay", () => {
        test("should return true when dates are same day", () => {
            const date1 = new Date("2023-01-01T12:00:00");
            const date2 = new Date("2023-01-01T18:00:00");
            expect(isSameDay(date1, date2)).toBe(true);
        });

        test("should return false when dates are different days", () => {
            const date1 = new Date("2023-01-01");
            const date2 = new Date("2023-01-02");
            expect(isSameDay(date1, date2)).toBe(false);
        });
    });

    describe("getWeekStart", () => {
        test("should return start of week", () => {
            const date = new Date("2023-01-04");
            const result = getWeekStart(date, "YYYY-MM-DD");
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test("should handle offset", () => {
            const date = new Date("2023-01-04");
            const result = getWeekStart(date, "YYYY-MM-DD", 1);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe("getWeekEnd", () => {
        test("should return end of week", () => {
            const date = new Date("2023-01-04");
            const result = getWeekEnd(date, "YYYY-MM-DD");
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test("should handle offset", () => {
            const date = new Date("2023-01-04");
            const result = getWeekEnd(date, "YYYY-MM-DD", 1);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe("getOneWeekRange", () => {
        test("should return array of start and end of week", () => {
            const date = new Date("2023-01-04");
            const result = getOneWeekRange(date);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
            expect(result[1]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });
    });

    describe("getMonthStart", () => {
        test("should return start of month", () => {
            const date = new Date("2023-01-15");
            const result = getMonthStart(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should handle offset", () => {
            const date = new Date("2023-01-15");
            const result = getMonthStart(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2023-02-01");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-01-15");
            const result = getMonthStart(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-12-01");
        });
    });

    describe("getMonthEnd", () => {
        test("should return end of month", () => {
            const date = new Date("2023-01-15");
            const result = getMonthEnd(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-31");
        });

        test("should handle offset", () => {
            const date = new Date("2023-01-15");
            const result = getMonthEnd(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2023-02-28");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-01-15");
            const result = getMonthEnd(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-12-31");
        });
    });

    describe("getOneMonthRange", () => {
        test("should return array of start and end of month", () => {
            const date = new Date("2023-01-15");
            const result = getOneMonthRange(date, "YYYY-MM-DD");
            expect(result).toHaveLength(2);
            expect(result[0]).toBe("2023-01-01");
            expect(result[1]).toBe("2023-01-31");
        });
    });

    describe("getYearStart", () => {
        test("should return start of year", () => {
            const date = new Date("2023-06-15");
            const result = getYearStart(date, "YYYY-MM-DD");
            expect(result).toBe("2023-01-01");
        });

        test("should handle offset", () => {
            const date = new Date("2023-06-15");
            const result = getYearStart(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2024-01-01");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-06-15");
            const result = getYearStart(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-01-01");
        });
    });

    describe("getYearEnd", () => {
        test("should return end of year", () => {
            const date = new Date("2023-06-15");
            const result = getYearEnd(date, "YYYY-MM-DD");
            expect(result).toBe("2023-12-31");
        });

        test("should handle offset", () => {
            const date = new Date("2023-06-15");
            const result = getYearEnd(date, "YYYY-MM-DD", 1);
            expect(result).toBe("2024-12-31");
        });

        test("should handle negative offset", () => {
            const date = new Date("2023-06-15");
            const result = getYearEnd(date, "YYYY-MM-DD", -1);
            expect(result).toBe("2022-12-31");
        });
    });

    describe("getOneYearRange", () => {
        test("should return array of start and end of year", () => {
            const date = new Date("2023-06-15");
            const result = getOneYearRange(date, "YYYY-MM-DD");
            expect(result).toHaveLength(2);
            expect(result[0]).toBe("2023-01-01");
            expect(result[1]).toBe("2023-12-31");
        });
    });

    describe("humanizeDuration", () => {
        test("should return empty string for non-number input", () => {
            expect(humanizeDuration("60")).toBe("");
            expect(humanizeDuration(null as any)).toBe("");
            expect(humanizeDuration(undefined as any)).toBe("");
        });

        test("should format seconds", () => {
            expect(humanizeDuration(30)).toBe("30秒");
            expect(humanizeDuration(59)).toBe("59秒");
        });

        test("should format minutes", () => {
            expect(humanizeDuration(60)).toBe("1分钟");
            expect(humanizeDuration(120)).toBe("2分钟");
            expect(humanizeDuration(90)).toBe("1分钟30秒");
            expect(humanizeDuration(3599)).toBe("59分钟59秒");
        });

        test("should format hours", () => {
            expect(humanizeDuration(3600)).toBe("1小时");
            expect(humanizeDuration(7200)).toBe("2小时");
            expect(humanizeDuration(3660)).toBe("1小时1分钟");
            expect(humanizeDuration(86399)).toBe("23小时59分钟");
        });

        test("should format days", () => {
            expect(humanizeDuration(86400)).toBe("1天");
            expect(humanizeDuration(172800)).toBe("2天");
            expect(humanizeDuration(90000)).toBe("1天1小时");
            expect(humanizeDuration(86460)).toBe("1天1分钟");
        });

        test("should handle zero seconds", () => {
            expect(humanizeDuration(0)).toBe("0秒");
        });
    });
});
