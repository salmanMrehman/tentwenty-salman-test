import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import * as timesheetService from "@services/timesheetService";
import { deriveStatusFromHours, sumEntryHours } from "@helpers/status";
import { FetchError } from "@helpers/fetcher";
import {
  EntryFormValues,
  TimesheetEntry,
  WeeklyTimesheetDetail,
} from "@types-app/timesheet.types";

/**
 * Shape used by `rejectWithValue` so callers can pull out field-level
 * errors that came from the server (e.g. validation).
 */
export interface MutationError {
  message: string;
  fields?: Record<string, string>;
}

function toMutationError(err: unknown, fallback: string): MutationError {
  if (err instanceof FetchError) {
    return { message: err.message, fields: err.fields };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: fallback };
}

/**
 * Per-week detail state: entries, totals and CRUD thunks.
 *
 * Status/totalHours are recomputed locally after each mutation so the UI
 * progress bar updates instantly without a full refetch.
 */

export interface WeekDetailState {
  data: WeeklyTimesheetDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  /** Tracks pending CRUD operations so the UI can show spinners/disable actions. */
  mutating: boolean;
}

const initialState: WeekDetailState = {
  data: null,
  status: "idle",
  error: null,
  mutating: false,
};

export const fetchWeekDetailThunk = createAsyncThunk(
  "weekDetail/fetch",
  async (id: string, { rejectWithValue }) => {
    try {
      return await timesheetService.fetchWeekDetail(id);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to load week.",
      );
    }
  },
);

export const createEntryThunk = createAsyncThunk<
  TimesheetEntry,
  { weekId: string; values: EntryFormValues },
  { rejectValue: MutationError }
>("weekDetail/createEntry", async (args, { rejectWithValue }) => {
  try {
    return await timesheetService.createEntry(args.weekId, args.values);
  } catch (err) {
    return rejectWithValue(toMutationError(err, "Failed to create entry."));
  }
});

export const updateEntryThunk = createAsyncThunk<
  TimesheetEntry,
  { id: string; values: Partial<EntryFormValues> },
  { rejectValue: MutationError }
>("weekDetail/updateEntry", async (args, { rejectWithValue }) => {
  try {
    return await timesheetService.updateEntry(args.id, args.values);
  } catch (err) {
    return rejectWithValue(toMutationError(err, "Failed to update entry."));
  }
});

export const deleteEntryThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: MutationError }
>("weekDetail/deleteEntry", async (id, { rejectWithValue }) => {
  try {
    await timesheetService.deleteEntry(id);
    return id;
  } catch (err) {
    return rejectWithValue(toMutationError(err, "Failed to delete entry."));
  }
});

/** Recomputes totals + status after entry list changes. */
function recomputeTotals(state: WeekDetailState): void {
  if (!state.data) return;
  state.data.totalHours = sumEntryHours(state.data.entries);
  state.data.status = deriveStatusFromHours(state.data.totalHours);
}

const weekDetailSlice = createSlice({
  name: "weekDetail",
  initialState,
  reducers: {
    clear(state) {
      state.data = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeekDetailThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchWeekDetailThunk.fulfilled,
        (state, action: PayloadAction<WeeklyTimesheetDetail>) => {
          state.status = "succeeded";
          state.data = action.payload;
        },
      )
      .addCase(fetchWeekDetailThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Failed to load week.";
      })

      // Mutations: keep `mutating` flipped while in flight, then patch
      // the local list optimistically on success.
      .addCase(createEntryThunk.pending, (state) => {
        state.mutating = true;
      })
      .addCase(
        createEntryThunk.fulfilled,
        (state, action: PayloadAction<TimesheetEntry>) => {
          state.mutating = false;
          if (state.data) {
            state.data.entries = [...state.data.entries, action.payload];
            recomputeTotals(state);
          }
        },
      )
      .addCase(createEntryThunk.rejected, (state) => {
        state.mutating = false;
      })

      .addCase(updateEntryThunk.pending, (state) => {
        state.mutating = true;
      })
      .addCase(
        updateEntryThunk.fulfilled,
        (state, action: PayloadAction<TimesheetEntry>) => {
          state.mutating = false;
          if (state.data) {
            state.data.entries = state.data.entries.map((e) =>
              e.id === action.payload.id ? action.payload : e,
            );
            recomputeTotals(state);
          }
        },
      )
      .addCase(updateEntryThunk.rejected, (state) => {
        state.mutating = false;
      })

      .addCase(deleteEntryThunk.pending, (state) => {
        state.mutating = true;
      })
      .addCase(
        deleteEntryThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.mutating = false;
          if (state.data) {
            state.data.entries = state.data.entries.filter(
              (e) => e.id !== action.payload,
            );
            recomputeTotals(state);
          }
        },
      )
      .addCase(deleteEntryThunk.rejected, (state) => {
        state.mutating = false;
      });
  },
});

export const { clear: clearWeekDetail } = weekDetailSlice.actions;
export default weekDetailSlice.reducer;
