import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { Inter } from "next/font/google";
import Head from "next/head";
import { store } from "@store/index";
import { APP_STRINGS } from "@constants/strings";
import "@styles/globals.css";

/**
 * Inter is the design's font; loading it via `next/font` automatically
 * generates a CSS variable we hand off to Tailwind via tailwind.config.ts.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <Head>
          <title>{APP_STRINGS.brand.name} — Timesheets</title>
          <meta
            name="description"
            content="Simple, fast timesheet management."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${inter.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </ReduxProvider>
    </SessionProvider>
  );
}
