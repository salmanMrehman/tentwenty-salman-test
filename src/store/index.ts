import { configureStore } from "@reduxjs/toolkit";
import timesheetsReducer from "./slices/timesheetsSlice";
import weekDetailReducer from "./slices/weekDetailSlice";

/**
 * Single Redux store for the app.
 *
 * Two slices keep concerns separated:
 *  - `timesheets`: dashboard list + filters + pagination
 *  - `weekDetail`: the per-week page (entries + CRUD)
 */
export function makeStore() {
  return configureStore({
    reducer: {
      timesheets: timesheetsReducer,
      weekDetail: weekDetailReducer,
    },
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
