/**
 * Tiny structured logger.
 *
 * Keeps console output consistent and scoped, and silences low-severity noise
 * in production builds. `debug`/`info` are dev-only; `warn`/`error` always
 * surface (to the console only — never to the user-facing UI).
 *
 * Usage:
 *   const log = logger("OneSignal");
 *   log.warn("push unavailable", err);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isProduction = process.env.NODE_ENV === "production";

// In production we drop developer-oriented chatter but keep warnings/errors,
// which are useful in error-tracking tools and browser consoles.
const ENABLED: Record<LogLevel, boolean> = {
  debug: !isProduction,
  info: !isProduction,
  warn: true,
  error: true,
};

function emit(level: LogLevel, scope: string, message: string, meta?: unknown) {
  if (!ENABLED[level]) return;
  const prefix = `[${scope}]`;
  // console.debug maps to a verbose channel in most browsers; fall back to log.
  const sink =
    level === "debug" ? console.debug ?? console.log : console[level];
  if (meta !== undefined) sink(prefix, message, meta);
  else sink(prefix, message);
}

export function logger(scope: string) {
  return {
    debug: (message: string, meta?: unknown) => emit("debug", scope, message, meta),
    info: (message: string, meta?: unknown) => emit("info", scope, message, meta),
    warn: (message: string, meta?: unknown) => emit("warn", scope, message, meta),
    error: (message: string, meta?: unknown) => emit("error", scope, message, meta),
  };
}
