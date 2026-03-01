if (typeof window !== "undefined") {
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

    global.cancelAnimationFrame = (id) => {
        clearTimeout(id);
    };

    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}
