# Backend Request: Notification delete & "clear read" endpoints

**From:** Frontend
**Date:** 2026-06-08
**Priority:** High — current UI actions silently fail

## Problem

The frontend has a per-notification **Delete** (trash) button and a new **Clear read**
button on the notifications page. Both rely on deleting notifications, but the
**documented Notification API has no delete endpoint**. The only mutations available
today are:

- `POST   /api/v1/notification/send`
- `GET    /api/v1/notification/unread`
- `GET    /api/v1/notification/unread/count`
- `PUT    /api/v1/notification/mark-all-read`

(The frontend also calls `GET /api/v1/notification` to list all, and
`PATCH /api/v1/notification/{id}/read` to mark one read — these work but aren't in
the doc, so please also confirm/document them.)

**Result:** when a user clicks "Clear read" (or the trash icon), the request does not
persist. After a page refresh every notification reappears, because nothing was
actually removed from the database.

We've already made the frontend honest about this — it now removes a notification
from the list **only after the server confirms the delete** — so until these
endpoints exist the buttons will correctly show that nothing was cleared.

## What we need

### 1. Delete a single notification (required)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/v1/notification/{id}` |
| **Auth** | Required — recipient only |

**Path params:** `id` — notification id.

**Response** `200`
```json
{ "status": 200, "success": true, "message": "Notification deleted.", "data": null }
```
- `403` if the notification doesn't belong to the current user.
- `404` if it doesn't exist.

### 2. Clear all read notifications (required — the main ask)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/v1/notification/read` |
| **Auth** | Required |

Deletes **all notifications that are already read** for the current user in one call.
This is what the "Clear read" button should hit (instead of N individual deletes).

**Response** `200`
```json
{ "status": 200, "success": true, "message": "Read notifications cleared.", "data": { "deletedCount": 12 } }
```
- Returning `deletedCount` is nice-to-have; `data: null` is fine too.
- Should be a no-op (still `200`) when there are no read notifications.

### 3. (Optional) Clear all notifications

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/v1/notification` |
| **Auth** | Required |

Deletes **all** of the current user's notifications (read and unread). Optional, but
handy for a future "Clear all" action.

## Notes

- All endpoints must scope to the **authenticated recipient** — a user can only delete
  their own notifications.
- Once `DELETE /api/v1/notification/read` exists, the frontend will switch the
  "Clear read" button from N individual `DELETE /{id}` calls to this single call.
- Please keep the standard response envelope (`status`/`success`/`message`/`data`).

## Frontend status

Ready on `develop`:
- `core/request.ts` — `clearReadNotificationsRequest` deletes read ids and returns
  only those the server confirmed (uses `Promise.allSettled`). Will be swapped to the
  bulk endpoint the moment it ships.
- `core/action.ts` / `core/reducer.ts` — "Clear read" only removes confirmed
  deletions from the UI and surfaces an error if the server kept them.
- `notifications/page.tsx` — the "Clear read" button.
