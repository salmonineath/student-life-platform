/**
 * OneSignal web-push integration — single source of truth.
 *
 * Push is an optional enhancement: the app must work perfectly whether OneSignal
 * is disabled (no env var), unavailable (unsupported browser), or misconfigured
 * (no Web platform set up in the OneSignal dashboard). Every entry point here is
 * guarded and fails silently to the user — problems are logged to the console
 * only.
 *
 * Why this module exists:
 *   - `OneSignal.login()` reaches into the SDK's internal state and throws
 *     (e.g. "Cannot read properties of undefined (reading 'Qe')") if it runs
 *     before `init()` has *successfully* completed. Init and login are triggered
 *     from different React effects, so they race. We serialize them behind a
 *     single shared init promise and only ever log in once init has resolved
 *     truthy.
 *   - Centralizing init/login/logout avoids duplicated, drifting guard logic
 *     across the layout, sidebar, and any future caller.
 */

import { logger } from "@/lib/logger";

// The SDK is browser-only; import lazily so it never runs during SSR.
type OneSignalSdk = (typeof import("react-onesignal"))["default"];

const log = logger("OneSignal");

// Resolves to `true` only when init() actually succeeded and the SDK is usable.
let initPromise: Promise<boolean> | null = null;
// Cache the dynamically-imported SDK so we import it at most once.
let sdkPromise: Promise<OneSignalSdk> | null = null;

function loadSdk(): Promise<OneSignalSdk> {
  if (!sdkPromise) {
    sdkPromise = import("react-onesignal").then((m) => m.default);
  }
  return sdkPromise;
}

/** True when an app id is configured, i.e. push is meant to be enabled. */
export function isOneSignalEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID);
}

/**
 * Initialize OneSignal exactly once per page load.
 * Resolves to `true` when the SDK is ready to use, `false` otherwise.
 * Safe to call repeatedly and from multiple components — they share one promise.
 */
export function initOneSignal(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (typeof window === "undefined") return false;

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) {
      log.debug("Disabled — NEXT_PUBLIC_ONESIGNAL_APP_ID is not set.");
      return false;
    }

    try {
      const OneSignal = await loadSdk();
      await OneSignal.init({
        appId,
        // Allow push to work on http://localhost during development.
        allowLocalhostAsSecureOrigin: true,
      });

      // Non-blocking opt-in prompt. Its own failure must not flip init to false.
      OneSignal.Slidedown.promptPush().catch((err) =>
        log.debug("Slidedown prompt skipped.", err),
      );

      log.info("Initialized.");
      return true;
    } catch (err) {
      // Most common cause: the OneSignal app has no Web Push platform configured
      // in the dashboard ("App not configured for web push"). Nothing the client
      // can do — degrade gracefully and keep the rest of the app working.
      log.warn(
        "Push notifications are unavailable; continuing without them.",
        err,
      );
      return false;
    }
  })();

  return initPromise;
}

/**
 * Link this browser's push subscription to a logged-in user so the backend can
 * target notifications by external id. Waits for init and no-ops if push is
 * unavailable — never throws.
 */
export async function loginOneSignal(externalId: string): Promise<void> {
  if (!externalId) return;
  const ready = await initOneSignal();
  if (!ready) return;

  try {
    const OneSignal = await loadSdk();
    await OneSignal.login(externalId);
    log.debug("Linked external id.", externalId);
  } catch (err) {
    log.warn("Could not link user to push subscription.", err);
  }
}

/**
 * Unlink this browser's subscription on logout so the next user on the device
 * doesn't receive the previous user's notifications. No-ops if push never
 * initialized — never throws.
 */
export async function logoutOneSignal(): Promise<void> {
  // If init was never attempted or didn't succeed, there's nothing to unlink.
  if (!initPromise) return;
  const ready = await initPromise;
  if (!ready) return;

  try {
    const OneSignal = await loadSdk();
    await OneSignal.logout();
    log.debug("Unlinked subscription.");
  } catch (err) {
    log.warn("Could not unlink push subscription on logout.", err);
  }
}
