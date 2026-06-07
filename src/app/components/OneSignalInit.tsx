"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";
import { useAppSelector } from "@/redux/hook";

// Module-level flag — OneSignal.init() must only ever run once per page load
// (React Strict Mode double-invokes effects in dev).
let initialized = false;

export default function OneSignalInit() {
  const user = useAppSelector((state) => state.auth.user);
  const loggedInId = useRef<string | null>(null);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId || initialized) return;
    initialized = true;

    OneSignal.init({
      appId,
      // Lets push work on http://localhost during development
      allowLocalhostAsSecureOrigin: true,
    })
      .then(() => {
        // Ask for permission via the non-blocking slidedown prompt
        OneSignal.Slidedown.promptPush();
      })
      .catch((e) => console.error("OneSignal init failed:", e));
  }, []);

  // Link the browser subscription to the logged-in user so the backend
  // can target notifications by external id (user.id).
  useEffect(() => {
    if (!user) return;
    const externalId = String(user.id);
    if (loggedInId.current === externalId) return;
    loggedInId.current = externalId;

    OneSignal.login(externalId).catch((e) =>
      console.error("OneSignal login failed:", e),
    );
  }, [user]);

  return null;
}
