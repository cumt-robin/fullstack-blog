import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { CommentUserInfo, UserDTO } from "@/bean/dto";
import { getLocalData } from "@/utils/bom";
import { userService } from "@/services/user";
import { LoginModel } from "@/bean/xhr";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(getLocalData({ key: "token" }));

    const isAuthed = computed(() => !!token.value);

    const setToken = (value: string | null) => {
        if (value === null) {
            token.value = "";
            localStorage.removeItem("token");
        } else {
            token.value = value;
            localStorage.setItem("token", value);
        }
    };

    const userInfo = ref(getLocalData<UserDTO>({ key: "userInfo", parse: true }));

    const setUserInfo = (value: UserDTO | null) => {
        if (value === null) {
            userInfo.value = null;
            localStorage.removeItem("userInfo");
        } else {
            userInfo.value = value;
            localStorage.setItem("userInfo", JSON.stringify(value));
        }
    };

    const commentUserInfo = ref(getLocalData<CommentUserInfo>({ key: "commentUserInfo", parse: true }));

    const setCommentUserInfo = (value: CommentUserInfo | null) => {
        if (value === null) {
            commentUserInfo.value = null;
            localStorage.removeItem("commentUserInfo");
        } else {
            commentUserInfo.value = value;
            localStorage.setItem("commentUserInfo", JSON.stringify(value));
        }
    };

    const clearUserSession = () => {
        setToken(null);
        setUserInfo(null);
    };

    const dispatchLogin = async (payload: LoginModel) => {
        const { data } = await userService.login(payload);
        setToken(data.token);
        setUserInfo(data);
        return data;
    };

    const dispatchLogout = async () => {
        await userService.logout();
        clearUserSession();
    };

    return {
        token,
        isAuthed,
        userInfo,
        setToken,
        setUserInfo,
        commentUserInfo,
        setCommentUserInfo,
        clearUserSession,
        dispatchLogin,
        dispatchLogout,
    };
});
