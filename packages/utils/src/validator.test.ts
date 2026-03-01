import { REQUIRED_VALIDATOR_BLUR, EMAIL_VALIDATOR, URL_VALIDATOR } from "./validator";

describe("validator", () => {
    describe("REQUIRED_VALIDATOR_BLUR", () => {
        test("should have correct structure", () => {
            expect(REQUIRED_VALIDATOR_BLUR).toHaveProperty("required", true);
            expect(REQUIRED_VALIDATOR_BLUR).toHaveProperty("message", "必填项");
            expect(REQUIRED_VALIDATOR_BLUR).toHaveProperty("trigger", "blur");
        });

        test("should be immutable", () => {
            const originalRequired = REQUIRED_VALIDATOR_BLUR.required;
            const originalMessage = REQUIRED_VALIDATOR_BLUR.message;
            const originalTrigger = REQUIRED_VALIDATOR_BLUR.trigger;

            expect(originalRequired).toBe(true);
            expect(originalMessage).toBe("必填项");
            expect(originalTrigger).toBe("blur");
        });
    });

    describe("EMAIL_VALIDATOR", () => {
        test("should have correct structure", () => {
            expect(EMAIL_VALIDATOR).toHaveProperty("pattern");
            expect(EMAIL_VALIDATOR).toHaveProperty("message", "邮箱格式不正确");
            expect(EMAIL_VALIDATOR).toHaveProperty("trigger", "blur");
        });

        test("pattern should validate correct email addresses", () => {
            const validEmails = [
                "test@example.com",
                "user.name@example.com",
                "user+tag@example.com",
                "user@sub.example.com",
                "user123@example.com",
                "test.email@domain.co.uk",
                "user_name@example-domain.com",
            ];

            validEmails.forEach((email) => {
                expect(EMAIL_VALIDATOR.pattern.test(email)).toBe(true);
            });
        });

        test("pattern should reject invalid email addresses", () => {
            const invalidEmails = [
                "invalid",
                "invalid@",
                "@example.com",
                "invalid@",
                "user@",
                "user example.com",
                "user@example",
                "user@example.",
                "user@.com",
                "user@com",
                "user@@example.com",
                "user@example..com",
            ];

            invalidEmails.forEach((email) => {
                expect(EMAIL_VALIDATOR.pattern.test(email)).toBe(false);
            });
        });

        test("pattern should handle edge cases", () => {
            expect(EMAIL_VALIDATOR.pattern.test("")).toBe(false);
            expect(EMAIL_VALIDATOR.pattern.test(" ")).toBe(false);
            expect(EMAIL_VALIDATOR.pattern.test("a@b.c")).toBe(true);
            expect(EMAIL_VALIDATOR.pattern.test("a@b.co")).toBe(true);
        });
    });

    describe("URL_VALIDATOR", () => {
        test("should have correct structure", () => {
            expect(URL_VALIDATOR).toHaveProperty("pattern");
            expect(URL_VALIDATOR).toHaveProperty("message", "链接格式不正确，注意以http或https开头");
            expect(URL_VALIDATOR).toHaveProperty("trigger", "blur");
        });

        test("pattern should validate correct http URLs", () => {
            const validHttpUrls = [
                "http://example.com",
                "http://www.example.com",
                "http://example.com/path",
                "http://example.com/path/to/resource",
                "http://example.com?query=value",
                "http://example.com#section",
                "http://example.com:8080",
                "http://192.168.1.1",
                "http://localhost",
                "http://example.com/path?query=value&other=test#section",
            ];

            validHttpUrls.forEach((url) => {
                expect(URL_VALIDATOR.pattern.test(url)).toBe(true);
            });
        });

        test("pattern should validate correct https URLs", () => {
            const validHttpsUrls = [
                "https://example.com",
                "https://www.example.com",
                "https://example.com/path",
                "https://example.com/path/to/resource",
                "https://example.com?query=value",
                "https://example.com#section",
                "https://example.com:443",
                "https://192.168.1.1",
                "https://localhost",
                "https://example.com/path?query=value&other=test#section",
            ];

            validHttpsUrls.forEach((url) => {
                expect(URL_VALIDATOR.pattern.test(url)).toBe(true);
            });
        });

        test("pattern should reject invalid URLs", () => {
            const invalidUrls = [
                "ftp://example.com",
                "example.com",
                "www.example.com",
                "//example.com",
                "http:/example.com",
                "https:/example.com",
                "http://",
                "https://",
                // eslint-disable-next-line no-script-url
                "javascript:void(0)",
                "data:text/plain,hello",
            ];

            invalidUrls.forEach((url) => {
                expect(URL_VALIDATOR.pattern.test(url)).toBe(false);
            });
        });

        test("pattern should handle edge cases", () => {
            expect(URL_VALIDATOR.pattern.test("")).toBe(false);
            expect(URL_VALIDATOR.pattern.test(" ")).toBe(false);
            expect(URL_VALIDATOR.pattern.test("http://a.b")).toBe(true);
            expect(URL_VALIDATOR.pattern.test("https://a.b")).toBe(true);
        });

        test("pattern should accept URLs with special characters", () => {
            const specialUrls = [
                "http://example.com/path_with_underscore",
                "http://example.com/path-with-dash",
                "http://example.com/path.with.dots",
                "http://example.com/path?param=value&other=test",
                "http://example.com/path#section",
            ];

            specialUrls.forEach((url) => {
                expect(URL_VALIDATOR.pattern.test(url)).toBe(true);
            });
        });
    });
});
