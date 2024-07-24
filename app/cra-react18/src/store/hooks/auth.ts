import { useSelector } from "react-redux";
import { selectIsAuthed } from "../slices/auth";
import { RootState } from "..";

export const useIsAuthed = () => {
    return useSelector((state: RootState) => selectIsAuthed(state));
};
