/**
 * 仅支持在客户端使用
 */
export const storage = {
    /**
     * 获取sessionStorage或localStorage中数据
     * @param {String} key 存储的键名
     * @param {Boolean} isLocal 是否取localStorage
     */
    get(key: string, isLocal = false): string | null {
        if (isLocal) {
            return localStorage.getItem(key);
        } else {
            return sessionStorage.getItem(key);
        }
    },
    /**
     * 设置sessionStorage或localStorage中数据
     * @param {String} key 存储的键名
     * @param {any} value 存储的键值
     * @param {Boolean} isLocal 是否设置localStorage中数据
     */
    set(key: string, value: string, isLocal = false): void {
        if (isLocal) {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    },
    /**
     * 移除sessionStorage或localStorage中数据
     * @param {String} key 存储的键名
     * @param {Boolean} isLocal 是否移除localStorage中数据
     */
    remove(key: string, isLocal = false): void {
        if (isLocal) {
            localStorage.removeItem(key);
        } else {
            sessionStorage.removeItem(key);
        }
    },
    /**
     * 清空sessionStorage或localStorage中数据
     * @param {Boolean} isLocal 是否清空localStorage中数据
     */
    clear(isLocal = false): void {
        if (isLocal) {
            localStorage.clear();
        } else {
            sessionStorage.clear();
        }
    },
};
