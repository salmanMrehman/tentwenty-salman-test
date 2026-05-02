import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { AppDispatch, RootState } from "./index";

/**
 * Pre-typed Redux hooks. Components should always use these instead of
 * the raw `useDispatch` / `useSelector` to get full type safety.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
