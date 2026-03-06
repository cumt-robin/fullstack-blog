import { getOffset, setScrollTop, triggerC3Animation, addClass, removeClass, getScrollContainer } from "./dom";

describe("dom", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    describe("getOffset", () => {
        test("should return offset for element", () => {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = "100px";
            div.style.top = "200px";
            document.body.appendChild(div);

            const result = getOffset(div);
            expect(result).toHaveProperty("offsetLeft");
            expect(result).toHaveProperty("offsetTop");
            expect(typeof result.offsetLeft).toBe("number");
            expect(typeof result.offsetTop).toBe("number");
        });

        test("should return offset relative to custom node", () => {
            const parent = document.createElement("div");
            parent.style.position = "absolute";
            parent.style.left = "50px";
            parent.style.top = "50px";

            const child = document.createElement("div");
            child.style.position = "absolute";
            child.style.left = "20px";
            child.style.top = "30px";

            parent.appendChild(child);
            document.body.appendChild(parent);

            const result = getOffset(child, parent);
            expect(result).toHaveProperty("offsetLeft");
            expect(result).toHaveProperty("offsetTop");
        });

        test("should handle element with no offset parent", () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const result = getOffset(div);
            expect(result).toHaveProperty("offsetLeft");
            expect(result).toHaveProperty("offsetTop");
            expect(result.offsetLeft).toBe(0);
            expect(result.offsetTop).toBe(0);
        });
    });

    describe("setScrollTop", () => {
        beforeEach(() => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });

        test("should set scroll top without animation", () => {
            setScrollTop({ targetValue: 100, useAnimation: false });
            expect(document.body.scrollTop).toBe(100);
            expect(document.documentElement.scrollTop).toBe(100);
        });

        test("should set scroll top to 0 by default", () => {
            setScrollTop({ useAnimation: false });
            expect(document.body.scrollTop).toBe(0);
            expect(document.documentElement.scrollTop).toBe(0);
        });

        test("should handle custom element", () => {
            const div = document.createElement("div");
            div.style.height = "1000px";
            div.style.overflow = "auto";
            document.body.appendChild(div);

            setScrollTop({ target: div, targetValue: 50, useAnimation: false });
            expect(div.scrollTop).toBe(50);
        });

        test("should handle animation", () => {
            jest.useFakeTimers();
            setScrollTop({ targetValue: 100, useAnimation: true, duration: 0.5 });
            jest.advanceTimersByTime(600);
            expect(document.body.scrollTop).toBe(100);
            expect(document.documentElement.scrollTop).toBe(100);
            jest.useRealTimers();
        });

        test("should not animate if current scroll equals target", () => {
            document.body.scrollTop = 100;
            document.documentElement.scrollTop = 100;

            jest.useFakeTimers();
            setScrollTop({ targetValue: 100, useAnimation: true, duration: 0.5 });
            jest.advanceTimersByTime(600);
            expect(document.body.scrollTop).toBe(100);
            expect(document.documentElement.scrollTop).toBe(100);
            jest.useRealTimers();
        });
    });

    describe("triggerC3Animation", () => {
        test("should trigger animation with requestAnimationFrame", () => {
            const removeAnimClass = jest.fn();
            const setAnimClass = jest.fn();
            jest.useFakeTimers({ legacyFakeTimers: true });
            triggerC3Animation(removeAnimClass, setAnimClass);
            expect(removeAnimClass).toHaveBeenCalled();
            jest.advanceTimersByTime(0);
            jest.advanceTimersByTime(0);
            jest.runAllTimers();
            expect(setAnimClass).toHaveBeenCalled();
            jest.useRealTimers();
        });
    });

    describe("addClass", () => {
        test("should add single class to element", () => {
            const div = document.createElement("div");
            addClass(div, "test-class");
            expect(div.classList.contains("test-class")).toBe(true);
        });

        test("should add multiple classes to element", () => {
            const div = document.createElement("div");
            addClass(div, ["class1", "class2", "class3"]);
            expect(div.classList.contains("class1")).toBe(true);
            expect(div.classList.contains("class2")).toBe(true);
            expect(div.classList.contains("class3")).toBe(true);
        });

        test("should handle string selector", () => {
            const div = document.createElement("div");
            div.id = "test-element";
            document.body.appendChild(div);

            addClass("#test-element", "test-class");
            expect(div.classList.contains("test-class")).toBe(true);
        });
    });

    describe("removeClass", () => {
        test("should remove single class from element", () => {
            const div = document.createElement("div");
            div.classList.add("test-class");
            removeClass(div, "test-class");
            expect(div.classList.contains("test-class")).toBe(false);
        });

        test("should remove multiple classes from element", () => {
            const div = document.createElement("div");
            div.classList.add("class1", "class2", "class3");
            removeClass(div, ["class1", "class2"]);
            expect(div.classList.contains("class1")).toBe(false);
            expect(div.classList.contains("class2")).toBe(false);
            expect(div.classList.contains("class3")).toBe(true);
        });

        test("should handle string selector", () => {
            const div = document.createElement("div");
            div.id = "test-element";
            div.classList.add("test-class");
            document.body.appendChild(div);

            removeClass("#test-element", "test-class");
            expect(div.classList.contains("test-class")).toBe(false);
        });
    });

    describe("getScrollContainer", () => {
        test("should return body when no scroll container found", () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const result = getScrollContainer(div);
            expect(result).toBe(document.body);
        });

        test("should return scroll container with overflow scroll", () => {
            const container = document.createElement("div");
            container.style.overflow = "scroll";
            container.style.height = "200px";

            const child = document.createElement("div");
            container.appendChild(child);
            document.body.appendChild(container);

            const result = getScrollContainer(child);
            expect(result).toBe(container);
        });

        test("should return scroll container with overflow auto", () => {
            const container = document.createElement("div");
            container.style.overflow = "auto";
            container.style.height = "200px";

            const child = document.createElement("div");
            container.appendChild(child);
            document.body.appendChild(container);

            const result = getScrollContainer(child);
            expect(result).toBe(container);
        });

        test("should handle horizontal scroll direction", () => {
            const container = document.createElement("div");
            container.style.overflowX = "scroll";
            container.style.width = "200px";

            const child = document.createElement("div");
            container.appendChild(child);
            document.body.appendChild(container);

            const result = getScrollContainer(child, "horizontal");
            expect(result).toBe(container);
        });

        test("should handle vertical scroll direction", () => {
            const container = document.createElement("div");
            container.style.overflowY = "scroll";
            container.style.height = "200px";

            const child = document.createElement("div");
            container.appendChild(child);
            document.body.appendChild(container);

            const result = getScrollContainer(child, "vertical");
            expect(result).toBe(container);
        });

        test("should return body when reaching document body", () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const result = getScrollContainer(div);
            expect(result).toBe(document.body);
        });

        test("should return null when no parent found", () => {
            const div = document.createElement("div");
            const result = getScrollContainer(div);
            expect(result).not.toBeNull();
        });
    });
});
