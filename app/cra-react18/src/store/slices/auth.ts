import { createSelector, PayloadAction, buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getLocalData } from "@/utils/bom";
import { CommentUserInfo, UserDTO } from "@/bean/dto";
import { LoginModel } from "@/bean/xhr";
import { userService } from "@/services/user";

interface AuthState {
    token: string | null;
    userInfo: UserDTO | null;
    commentUserInfo: CommentUserInfo | null;
}

const initialState: AuthState = {
    token: getLocalData({ key: "token" }),
    userInfo: getLocalData<UserDTO>({ key: "userInfo", parse: true }),
    commentUserInfo: getLocalData<CommentUserInfo>({ key: "commentUserInfo", parse: true }),
};

export const createAuthSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

export const authSlice = createAuthSlice({
    name: "auth",
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        setToken: reducer((state, action: PayloadAction<string | null>) => {
            const value = action.payload;
            if (value === null) {
                state.token = "";
                localStorage.removeItem("token");
            } else {
                state.token = value;
                localStorage.setItem("token", value);
            }
        }),
        setUserInfo: reducer((state, action: PayloadAction<UserDTO | null>) => {
            const value = action.payload;
            if (value === null) {
                state.userInfo = null;
                localStorage.removeItem("userInfo");
            } else {
                state.userInfo = value;
                localStorage.setItem("userInfo", JSON.stringify(value));
            }
        }),
        setCommentUserInfo: reducer((state, action: PayloadAction<CommentUserInfo | null>) => {
            const value = action.payload;
            if (value === null) {
                state.commentUserInfo = null;
                localStorage.removeItem("commentUserInfo");
            } else {
                state.commentUserInfo = value;
                localStorage.setItem("commentUserInfo", JSON.stringify(value));
            }
        }),
        clearUserSession: asyncThunk(async (_, { dispatch }) => {
            dispatch(authSlice.actions.setToken(null));
            dispatch(authSlice.actions.setUserInfo(null));
        }),
        dispatchLogin: asyncThunk(async (payload: LoginModel, { dispatch }) => {
            const { data } = await userService.login(payload);
            dispatch(authSlice.actions.setToken(data.token));
            dispatch(authSlice.actions.setUserInfo(data));
            return data;
        }),
        dispatchLogout: asyncThunk(async (_, { dispatch }) => {
            await userService.logout();
            dispatch(authSlice.actions.clearUserSession());
        }),
    }),
});

// Selector
const selectToken = (state: RootState) => state.auth.token;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectCommentUserInfo = (state: RootState) => state.auth.commentUserInfo;
// Computed Selector
export const selectIsAuthed = createSelector(selectToken, (token) => !!token);
// Actions
export const { setCommentUserInfo, dispatchLogin, dispatchLogout } = authSlice.actions;
// Reducer
export default authSlice.reducer;
