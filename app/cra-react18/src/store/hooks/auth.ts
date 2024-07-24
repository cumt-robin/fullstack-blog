import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthed } from "../slices/auth";
import { AppDispatch, RootState } from "..";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useIsAuthed = () => {
    return useAppSelector((state) => selectIsAuthed(state));
};
