export const getApiBase = () => {
    return import.meta.server ? (import.meta.dev ? `http://127.0.0.1:8012` : "http://nest-server:8012") : `/gateway`;
};
