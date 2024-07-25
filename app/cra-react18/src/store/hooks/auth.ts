import { selectIsAuthed } from "../slices/auth";
import { useAppSelector } from ".";

export const useIsAuthed = () => {
    return useAppSelector((state) => selectIsAuthed(state));
};
