import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    isMenuVisible: boolean;
}

const initialState: UIState = {
    isMenuVisible: false,
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setIsMenuVisible: (state, action: PayloadAction<boolean>) => {
            state.isMenuVisible = action.payload;
        },
    },
});

export const { setIsMenuVisible } = uiSlice.actions;

export default uiSlice.reducer;
