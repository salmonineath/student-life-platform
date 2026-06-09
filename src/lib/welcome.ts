/**
 * One-time "welcome" handshake between registration and the dashboard.
 *
 * The backend doesn't (yet) expose a first-login / onboarding flag, so we set a
 * marker the moment registration succeeds and consume it exactly once when the
 * dashboard first renders. Because the flag is only ever written at sign-up and
 * removed on first read, the welcome toast:
 *   - shows exactly once, right after registration;
 *   - never repeats on refresh or client-side navigation (it's already cleared);
 *   - never appears for existing users signing in (it's never set for them).
 *
 * When the backend ships a real `isNewUser`/`onboardedAt` field, prefer that as
 * the source of truth and delete this helper.
 */

const WELCOME_KEY = "studentlife:welcome-pending";

/** Call right after a successful registration. */
export function markWelcomePending(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode, quota). The welcome toast is a
    // nice-to-have, so silently skip it rather than break the sign-up flow.
  }
}

/**
 * Returns true at most once after registration, then clears the flag so it
 * never fires again. Reads and clears atomically to survive React Strict Mode's
 * double-invoked effects in development.
 */
export function consumeWelcomePending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(WELCOME_KEY) !== "1") return false;
    window.localStorage.removeItem(WELCOME_KEY);
    return true;
  } catch {
    return false;
  }
}
