export const sleep = (seconds = 0) => {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
};

export const getLocalData = <T = string>(option: { key: string; parse?: boolean; defaultValue?: T }) => {
    const { key, parse = false, defaultValue } = option;
    const lData = localStorage.getItem(key);
    if (lData === null) {
        return defaultValue === undefined ? null : defaultValue;
    }
    if (parse) {
        return JSON.parse(lData) as T;
    }
    return lData as T;
};
