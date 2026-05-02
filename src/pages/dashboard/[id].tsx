import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { PageShell } from "@components/layout/PageShell/PageShell";
import { WeekDetail } from "@components/timesheet/WeekDetail/WeekDetail";
import { authOptions } from "../api/auth/[...nextauth]";
import { ROUTES } from "@constants/routes";
import { APP_STRINGS } from "@constants/strings";
import {
  clearWeekDetail,
  fetchWeekDetailThunk,
} from "@store/slices/weekDetailSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchProjects } from "@services/timesheetService";
import { Project } from "@types-app/timesheet.types";
import styles from "./detail.module.css";

interface PageProps {
  weekId: string;
}

/**
 * Per-week timesheet page.
 *
 * Pulls the week into Redux via `fetchWeekDetailThunk` on mount, and
 * the projects list (for the entry modal) into local state.
 *
 * Projects rarely change, so they don't need to live in Redux. If they
 * grew (e.g. with their own filters or pagination) they should be
 * promoted to a slice.
 */
export default function WeekPage({ weekId }: PageProps) {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.weekDetail.data);
  const status = useAppSelector((s) => s.weekDetail.status);
  const error = useAppSelector((s) => s.weekDetail.error);
  const mutating = useAppSelector((s) => s.weekDetail.mutating);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    dispatch(fetchWeekDetailThunk(weekId));
    return () => {
      dispatch(clearWeekDetail());
    };
  }, [dispatch, weekId]);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((list) => {
        if (!cancelled) setProjects(list);
      })
      .catch(() => {
        // Projects are non-critical; the modal will just have an empty
        // dropdown.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = status === "loading" || status === "idle";

  return (
    <>
      <Head>
        <title>
          {APP_STRINGS.weekDetail.title} — {APP_STRINGS.brand.name}
        </title>
      </Head>
      <PageShell>
        <Link href={ROUTES.dashboard} className={styles.back}>
          ← {APP_STRINGS.weekDetail.backToList}
        </Link>

        {status === "failed" ? (
          <div role="alert" className={styles.error}>
            {error ?? APP_STRINGS.weekDetail.loadError}
          </div>
        ) : null}

        {isLoading && !data ? (
          <div className={styles.skeleton} aria-busy="true">
            {APP_STRINGS.weekDetail.loading}
          </div>
        ) : data ? (
          <WeekDetail
            data={data}
            projects={projects}
            isMutating={mutating}
          />
        ) : null}
      </PageShell>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const weekId = String(ctx.params?.id ?? "");

  if (!session) {
    return {
      redirect: {
        destination: `${ROUTES.login}?callbackUrl=${encodeURIComponent(
          ROUTES.timesheetWeek(weekId),
        )}`,
        permanent: false,
      },
    };
  }

  return { props: { weekId } };
};
