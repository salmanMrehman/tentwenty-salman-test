import type { GetServerSideProps } from "next";
import { useEffect } from "react";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { PageShell } from "@components/layout/PageShell/PageShell";
import { TimesheetTable } from "@components/dashboard/TimesheetTable/TimesheetTable";
import { TimesheetFiltersBar } from "@components/dashboard/TimesheetFilters/TimesheetFilters";
import { Pagination } from "@components/common/Pagination/Pagination";
import { PageSizeSelect } from "@components/dashboard/PageSizeSelect/PageSizeSelect";
import { authOptions } from "../api/auth/[...nextauth]";
import { ROUTES } from "@constants/routes";
import { APP_STRINGS } from "@constants/strings";
import {
  fetchTimesheetsThunk,
  setFilters,
  setPage,
  setPerPage,
} from "@store/slices/timesheetsSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { TimesheetFilters } from "@types-app/timesheet.types";
import styles from "./dashboard.module.css";

/**
 * Dashboard page.
 *
 * The component is intentionally thin - all data lives in Redux. Filter
 * + pagination changes update the store, then a single effect issues
 * the network request whenever those inputs change.
 */
export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const list = useAppSelector((s) => s.timesheets.list);
  const status = useAppSelector((s) => s.timesheets.status);
  const error = useAppSelector((s) => s.timesheets.error);
  const filters = useAppSelector((s) => s.timesheets.filters);
  const pageInfo = useAppSelector((s) => s.timesheets.pageInfo);

  // Keep the request in lockstep with filter/page state.
  useEffect(() => {
    dispatch(
      fetchTimesheetsThunk({
        page: pageInfo.page,
        perPage: pageInfo.perPage,
        filters,
      }),
    );
  }, [dispatch, pageInfo.page, pageInfo.perPage, filters]);

  const handleFilterChange = (next: Partial<TimesheetFilters>) => {
    dispatch(setFilters(next));
    // Filter changes always reset to page 1.
    dispatch(setPage(1));
  };

  const isLoading = status === "loading";
  const showError = status === "failed";

  return (
    <>
      <Head>
        <title>{APP_STRINGS.dashboard.pageTitle} — {APP_STRINGS.brand.name}</title>
      </Head>
      <PageShell>
        <section className={styles.card}>
          <h1 className={styles.title}>{APP_STRINGS.dashboard.pageTitle}</h1>

          <TimesheetFiltersBar
            filters={filters}
            onChange={handleFilterChange}
          />

          {showError ? (
            <div role="alert" className={styles.error}>
              {error ?? APP_STRINGS.dashboard.loadError}
            </div>
          ) : null}

          {isLoading && list.length === 0 ? (
            <div className={styles.skeleton} aria-busy="true">
              {APP_STRINGS.dashboard.loading}
            </div>
          ) : (
            <TimesheetTable rows={list} isLoading={isLoading} />
          )}

          <div className={styles.footerRow}>
            <PageSizeSelect
              value={pageInfo.perPage}
              onChange={(n) => dispatch(setPerPage(n))}
            />
            <Pagination
              page={pageInfo.page}
              totalPages={pageInfo.totalPages}
              onChange={(p) => dispatch(setPage(p))}
            />
          </div>
        </section>
      </PageShell>
    </>
  );
}

/**
 * Require an authenticated session for the dashboard.
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard)}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};
