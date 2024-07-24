import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getLocalData } from "@/utils/bom";

interface AuthState {
    token: string | null;
}

const initialState: AuthState = {
    token: getLocalData({ key: "token" }),
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
    },
});

// Selector
const selectToken = (state: RootState) => state.auth.token;

// Computed Selector
export const selectIsAuthed = createSelector(selectToken, (token) => !!token);

export default authSlice.reducer;
