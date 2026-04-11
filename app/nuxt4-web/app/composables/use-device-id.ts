const DEVICE_ID_STORAGE_KEY = "device_id";

const createDeviceId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `device_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const useDeviceId = () => {
    if (import.meta.server) {
        return "";
    }

    const existed = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existed) {
        return existed;
    }

    const created = createDeviceId();
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, created);
    return created;
};
