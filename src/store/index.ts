/**
 * @author: Tusi
 * @description: 状态管理
 */
import { InjectionKey } from "vue";
import { createStore, Store, ActionContext } from "vuex";
import Cookies from "js-cookie";
import { SET_IS_MENU_VISIBLE, SET_COMMENT_USER_INFO, SET_USER_INFO, LOGIN_ACTION, LOGOUT_ACTION } from "./constants";
import { CommentUserInfo, UserDTO } from "@/bean/dto";
import { userService } from "@/services/user";
import { LoginModel } from "@/bean/xhr";

export interface RootState {
    isMenuVisible: boolean;
    commentUserInfo: CommentUserInfo | null;
    userInfo: UserDTO | null;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

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

const store = createStore<RootState>({
    state: {
        isMenuVisible: false,
        commentUserInfo,
        userInfo,
    },
    getters: {
        isAuthed: (state) => !!state.userInfo,
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
    },
    actions: {
        // 用户登录
        async [LOGIN_ACTION]({ commit }: ActionContext<RootState, RootState>, payload: LoginModel): Promise<UserDTO> {
            const res = await userService.login(payload);
            const userInfo = res.data;
            commit(SET_USER_INFO, userInfo);
            return userInfo;
        },
        // 用户登出
        async [LOGOUT_ACTION]({ commit }: ActionContext<RootState, RootState>): Promise<void> {
            await userService.logout();
            commit(SET_USER_INFO, null);
        },
    },
});

export const checkAuthState = (): void => {
    const isLogined = Cookies.get("islogined");
    if (isLogined !== "1") {
        // islogined失效
        store.commit(SET_USER_INFO, null);
    } else {
        // islogined有效，获取最新user信息
        userService.current().then((res) => {
            store.commit(SET_USER_INFO, res.data);
        });
    }
};

// 初始化时检查一次
checkAuthState();

export default store;
