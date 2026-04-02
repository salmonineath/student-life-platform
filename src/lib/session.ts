export const setSessionCookie = () => fetch("/api/session", { method: "POST" });

export const clearSessionCookie = () =>
  fetch("/api/session", { method: "DELETE" });
