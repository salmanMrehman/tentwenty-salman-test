import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import * as timesheetService from "@services/timesheetService";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@constants/timesheet";
import {
  PageInfo,
  TimesheetFilters,
  TimesheetStatus,
  WeeklyTimesheet,
} from "@types-app/timesheet.types";

/**
 * Dashboard state: filters, pagination, list, and request lifecycle.
 *
 * The slice's "fetchTimesheets" thunk reads filters+pagination from the
 * passed `params` (rather than from state) so the caller is in control
 * of *when* a refetch happens. This avoids subtle races where rapid
 * filter/page changes would each kick off a fetch.
 */

export interface TimesheetsState {
  list: WeeklyTimesheet[];
  pageInfo: PageInfo;
  filters: TimesheetFilters;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TimesheetsState = {
  list: [],
  pageInfo: {
    page: DEFAULT_PAGE,
    perPage: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  },
  filters: { status: "all" },
  status: "idle",
  error: null,
};

interface FetchParams {
  page: number;
  perPage: number;
  filters: TimesheetFilters;
}

export const fetchTimesheetsThunk = createAsyncThunk(
  "timesheets/fetch",
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      return await timesheetService.fetchTimesheets({
        page: params.page,
        perPage: params.perPage,
        ...params.filters,
      });
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to load timesheets.",
      );
    }
  },
);

const timesheetsSlice = createSlice({
  name: "timesheets",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<TimesheetFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { status: "all" };
    },
    setPage(state, action: PayloadAction<number>) {
      state.pageInfo.page = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.pageInfo.perPage = action.payload;
      // Reset to first page when page size changes.
      state.pageInfo.page = 1;
    },
    setStatusFilter(
      state,
      action: PayloadAction<TimesheetStatus | "all">,
    ) {
      state.filters.status = action.payload;
      state.pageInfo.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheetsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTimesheetsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.data;
        state.pageInfo = action.payload.pageInfo;
      })
      .addCase(fetchTimesheetsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Failed to load timesheets.";
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setPerPage,
  setStatusFilter,
} = timesheetsSlice.actions;

export default timesheetsSlice.reducer;
