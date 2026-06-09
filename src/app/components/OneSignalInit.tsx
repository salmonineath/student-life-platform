"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hook";
import { initOneSignal, loginOneSignal } from "@/lib/onesignal";

/**
 * Mounts the OneSignal web-push integration for authenticated areas.
 *
 * Initialization and user-linking are intentionally driven through the shared
 * service in `@/lib/onesignal`, which guarantees `login()` only runs after
 * `init()` has successfully completed (otherwise the SDK throws). Both effects
 * are safe no-ops when push is disabled, unsupported, or misconfigured.
 */
export default function OneSignalInit() {
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const linkedId = useRef<string | null>(null);

  // Kick off init once on mount. The service is idempotent.
  useEffect(() => {
    void initOneSignal();
  }, []);

  // Link the subscription to the logged-in user whenever that user changes.
  useEffect(() => {
    if (userId == null) return;
    const externalId = String(userId);
    if (linkedId.current === externalId) return;
    linkedId.current = externalId;
    void loginOneSignal(externalId);
  }, [userId]);

  return null;
}
