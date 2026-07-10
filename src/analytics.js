// Analytics: PostHog (product/engagement events + session replay) and Vercel
// Web Analytics (pageviews/referrers/device). Both are initialised once from
// main.jsx before the app renders. Every helper is a no-op until init runs and
// only ever touches the browser, so importing this on the server is safe.
import posthog from "posthog-js";
import { inject } from "@vercel/analytics";

// The PostHog project key is a *public* client-side token (it ships in the
// browser bundle no matter what), so a hardcoded default is fine — set
// VITE_POSTHOG_KEY / VITE_POSTHOG_HOST on Vercel only if you want to override.
const POSTHOG_KEY =
  import.meta.env.VITE_POSTHOG_KEY ||
  "phc_Bqpz94hEYUQCh3WggzQwpJhnxJKWfkm4LKtJKcMvDVBB";
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com";

let ready = false;

export const initAnalytics = () => {
  if (ready || typeof window === "undefined") return;

  // Only record real visits on the deployed site — never local dev or a
  // locally-served production build. Keeps localhost out of the data, and
  // leaves track()/trackPageview() as no-ops here (ready stays false).
  const host = window.location.hostname;
  if (import.meta.env.DEV || host === "localhost" || host === "127.0.0.1") {
    return;
  }

  ready = true;

  // Vercel Web Analytics. Framework-agnostic; auto-tracks SPA navigations by
  // patching history. Only actually reports once deployed on Vercel with
  // Analytics enabled — a harmless no-op in local dev.
  inject();

  if (!POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // We send $pageview ourselves on each react-router navigation (see
    // RouteAnalytics in App.jsx) — the default only fires on hard loads.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    // Records scrolling, clicks and the UI overlays. Note: the WebGL <canvas>
    // itself isn't captured (replay records the DOM, not rendered pixels).
    disable_session_recording: false,
  });
};

// Fire a custom event. Safe before init / when PostHog is unavailable.
export const track = (event, props) => {
  if (!ready || !POSTHOG_KEY) return;
  posthog.capture(event, props);
};

// Manual SPA pageview — called on every route change.
export const trackPageview = () => {
  if (!ready || !POSTHOG_KEY) return;
  posthog.capture("$pageview");
};
