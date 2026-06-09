/**
 * Safely extract a human-readable message from an unknown thrown value.
 *
 * Lets `catch` blocks use `catch (error)` (typed `unknown`) instead of
 * `catch (error: any)`, so error handling stays type-safe while still reading
 * the API's `response.data.message` when present.
 *
 * @param error    the value caught (axios error, Error, or anything)
 * @param fallback user-facing copy to use when the API didn't supply a message
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
