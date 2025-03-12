import { storage } from "~/utils/storage";
import { defineStore } from "pinia";
import type { UserDTO } from "~/types/dto/auth";
// import type { RecordResponse } from "~/types/xhr/response";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(useCookie("token").value);
    const userInfo = ref<UserDTO | null>(null);
    const isAuthed = computed(() => !!token.value);

    const setToken = (value?: string) => {
        const newValue = value || "";
        token.value = newValue;
        useCookie("token").value = newValue;
        refreshCookie("token");
    };

    const setUserInfo = (value: UserDTO | null) => {
        userInfo.value = value;
        if (!import.meta.env.SSR) {
            // 不是 ssr，同时更新到 storage
            if (value) {
                storage.set("userInfo", JSON.stringify(value), true);
            } else {
                storage.remove("userInfo", true);
            }
        }
    };

    const clearSession = () => {
        setToken("");
        setUserInfo(null);
    };

    const getCurrentUser = async () => {
        // const { $getApi } = useNuxtApp();
        // if (isAuthed.value) {
        //     const { result } = await $getApi<RecordResponse<UserDTO>>("/customer/umcUser/getUser");
        //     setUserInfo(result);
        // }
    };

    return {
        token,
        userInfo,
        isAuthed,
        setUserInfo,
        clearSession,
        getCurrentUser,
    };
});
