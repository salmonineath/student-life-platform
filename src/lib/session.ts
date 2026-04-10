export const setSessionCookie = () =>
  fetch("/api/session", {
    method: "POST",
    credentials: "include",
  });

export const clearSessionCookie = () =>
  fetch("/api/session", {
    method: "DELETE",
    credentials: "include",
  });