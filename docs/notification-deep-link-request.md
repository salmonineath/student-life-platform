# Backend Request: Notification deep-linking fields

**From:** Frontend
**Date:** 2026-06-08
**Endpoint affected:** `GET /notification` (and any other endpoint that returns a notification object, e.g. push payloads)

## Why

When a user clicks a notification on the notifications page, we want to take them
**straight to the thing the notification is about** (the specific assignment, group
chat, schedule item, etc.) instead of just landing on the section list page.

Today the notification payload only contains `type`, so the frontend can only route
to the *section* (`ASSIGNMENT` → `/assignments`). To deep-link to the exact item we
need an identifier for the referenced entity.

## What we need

Add **two optional fields** to every notification object in the response:

| Field         | Type             | Required | Description |
|---------------|------------------|----------|-------------|
| `referenceId` | `number \| string \| null` | preferred | The id of the entity the notification refers to. e.g. the assignment id for an `ASSIGNMENT`, the group id for `CHAT`/`INVITE`, the schedule id for `SCHEDULE`/`REMINDER`. `null` if not applicable (e.g. generic `SYSTEM`). |
| `link`        | `string \| null` | optional | An explicit **relative** in-app path the frontend should navigate to as-is, e.g. `"/assignments/42"`. Use this only when the route can't be derived from `type` + `referenceId`. **Must be a relative path, not an absolute URL.** |

`referenceId` alone is enough for the common cases — the frontend already knows the
base path per type and will build `/<base>/<referenceId>`. `link` is an escape hatch
for anything irregular.

### Mapping the frontend will apply

| `type`         | With `referenceId` → navigates to | Without `referenceId` → falls back to |
|----------------|-----------------------------------|----------------------------------------|
| `ASSIGNMENT`   | `/assignments/{referenceId}`      | `/assignments` |
| `CHAT`         | `/groups`*                        | `/groups` |
| `INVITE`       | `/groups`*                        | `/groups` |
| `SCHEDULE`     | `/schedules`*                     | `/schedules` |
| `REMINDER`     | `/schedules`*                     | `/schedules` |
| `ANNOUNCEMENT` | `/dashboard`                      | `/dashboard` |
| `SYSTEM`       | `/notifications`                  | `/notifications` |

\* These sections don't have an item-detail route on the frontend **yet**. Please
still send `referenceId` (group id / schedule id) — we'll wire up deep-linking for
them as those detail pages are built, or you can send a ready-made `link`.

If a `link` is present, the frontend uses it directly and ignores the table above.

## Expected response shape

`GET /notification` — unchanged envelope, just the two new fields per item:

```jsonc
{
  "status": 200,
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 101,
      "recipientId": 7,
      "title": "Assignment due soon",
      "message": "Your Calculus problem set is due in 2 hours.",
      "type": "ASSIGNMENT",
      "read": false,
      "createdAt": "2026-06-08T09:30:00Z",

      "referenceId": 42,            // NEW — the assignment id
      "link": null                  // NEW — optional explicit path
    },
    {
      "id": 102,
      "recipientId": 7,
      "title": "Welcome!",
      "message": "Your account is ready.",
      "type": "SYSTEM",
      "read": true,
      "createdAt": "2026-06-07T08:00:00Z",
      "referenceId": null,          // null is fine when nothing to link to
      "link": null
    }
  ]
}
```

## Notes / constraints

- **Backwards compatible:** both fields are optional. If they're omitted or `null`,
  the frontend falls back to the section route — nothing breaks. You can ship them
  incrementally (e.g. `ASSIGNMENT` first).
- `link` must be a **relative** path (`/assignments/42`), never an absolute URL —
  we route internally with the Next.js router and want to avoid open-redirect risk.
- Please include the same fields anywhere else a notification is serialized
  (e.g. OneSignal / web-push payloads) so click-through works from those too.

## Frontend status

Already merged on `develop` and ready to consume these fields the moment they appear:
- `src/types/notificationType.ts` — `referenceId` and `link` added as optional.
- `src/app/(student)/notifications/page.tsx` — `resolveDestination()` uses `link`,
  then `referenceId`, then the section fallback.
