import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getLocalData } from "@/utils/bom";
import { CommentUserInfo, UserDTO } from "@/bean/dto";

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

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            const value = action.payload;
            if (value === null) {
                state.token = "";
                localStorage.removeItem("token");
            } else {
                state.token = value;
                localStorage.setItem("token", value);
            }
        },
        setUserInfo: (state, action: PayloadAction<UserDTO | null>) => {
            const value = action.payload;
            if (value === null) {
                state.userInfo = null;
                localStorage.removeItem("userInfo");
            } else {
                state.userInfo = value;
                localStorage.setItem("userInfo", JSON.stringify(value));
            }
        },
        setCommentUserInfo: (state, action: PayloadAction<CommentUserInfo | null>) => {
            const value = action.payload;
            if (value === null) {
                state.commentUserInfo = null;
                localStorage.removeItem("commentUserInfo");
            } else {
                state.commentUserInfo = value;
                localStorage.setItem("commentUserInfo", JSON.stringify(value));
            }
        },
    },
});

// Selector
const selectToken = (state: RootState) => state.auth.token;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectCommentUserInfo = (state: RootState) => state.auth.commentUserInfo;
// Computed Selector
export const selectIsAuthed = createSelector(selectToken, (token) => !!token);
// Actions
export const { setCommentUserInfo } = authSlice.actions;
export default authSlice.reducer;
