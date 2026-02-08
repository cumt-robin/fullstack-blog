/**
 * @author: Tusi
 * @description: 状态管理
 */
import { InjectionKey } from "vue";
import { createStore, Store, ActionContext, useStore } from "vuex";
import { CommentUserInfo, LoginModel, UserDTO } from "@fullstack-blog/types";
import { userService } from "@fullstack-blog/services";
import {
    SET_IS_MENU_VISIBLE,
    SET_COMMENT_USER_INFO,
    SET_USER_INFO,
    SET_USER_TOKEN,
    LOGIN_ACTION,
    LOGOUT_ACTION,
    CLEAR_USER_SESSION,
} from "./constants";

export interface RootState {
    token: string;
    isMenuVisible: boolean;
    commentUserInfo: CommentUserInfo | null;
    userInfo: UserDTO | null;
}

export const key: InjectionKey<Store<RootState>> = Symbol("key");

let commentUserInfo = null;
const commentUserInfoInStorage = localStorage.getItem("commentUserInfo");
if (commentUserInfoInStorage) {
    commentUserInfo = JSON.parse(commentUserInfoInStorage);
}

let userInfo = null;
const userInfoInStorage = localStorage.getItem("userInfo");
if (userInfoInStorage) {
    userInfo = JSON.parse(userInfoInStorage);
}

const token = localStorage.getItem("token") || "";

const store = createStore<RootState>({
    state: {
        token,
        isMenuVisible: false,
        commentUserInfo,
        userInfo,
    },
    getters: {
        isAuthed: (state) => !!state.token,
    },
    mutations: {
        [SET_IS_MENU_VISIBLE](state: RootState, payload: boolean): void {
            state.isMenuVisible = payload;
        },
        [SET_COMMENT_USER_INFO](state: RootState, payload: CommentUserInfo): void {
            if (payload) {
                state.commentUserInfo = payload;
                localStorage.setItem("commentUserInfo", JSON.stringify(payload));
            } else {
                state.commentUserInfo = null;
                localStorage.removeItem("commentUserInfo");
            }
        },
        [SET_USER_INFO](state: RootState, payload: UserDTO): void {
            if (payload) {
                state.userInfo = payload;
                localStorage.setItem("userInfo", JSON.stringify(payload));
            } else {
                state.userInfo = null;
                localStorage.removeItem("userInfo");
            }
        },
        [SET_USER_TOKEN](state: RootState, payload: string): void {
            if (payload) {
                state.token = payload;
                localStorage.setItem("token", payload);
            } else {
                state.token = "";
                localStorage.removeItem("token");
            }
        },
    },
    actions: {
        // 用户登录
        async [LOGIN_ACTION]({ commit }: ActionContext<RootState, RootState>, payload: LoginModel): Promise<UserDTO> {
            const { data } = await userService.login(payload);
            const userInfo = data;
            commit(SET_USER_TOKEN, data.token);
            commit(SET_USER_INFO, userInfo);
            return userInfo;
        },
        // 用户登出
        async [LOGOUT_ACTION]({ dispatch }: ActionContext<RootState, RootState>): Promise<void> {
            await userService.logout();
            dispatch(CLEAR_USER_SESSION);
        },
        async [CLEAR_USER_SESSION]({ commit }: ActionContext<RootState, RootState>): Promise<void> {
            commit(SET_USER_TOKEN, null);
            commit(SET_USER_INFO, null);
        },
    },
});

export default store;

export const useBaseStore = (): Store<RootState> => useStore(key);
