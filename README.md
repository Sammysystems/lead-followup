# Lead Follow-Up System

Automated lead follow-up, appointment booking and no-show recovery for **LandsandHousing** — a property advisory in Uyo, Akwa Ibom.

**Status: deployed.**

## The problem

A property enquiry arrives at 11pm. Nobody sees it until morning. By then the buyer has three other agents on WhatsApp. The same applies to an appointment booked on Tuesday for Thursday: nobody remembers to confirm it, and half the people who meant to come simply don't.

## What it does

- **Captures** every lead from the landing page through a webhook, not a spreadsheet.
- **Replies immediately** with a real response rather than a receipt.
- **Follows up** on a schedule instead of when someone remembers.
- **Confirms and reminds** before every appointment.
- **Recovers no-shows** with a reschedule offer instead of a lost booking.

## Architecture

| Piece | Choice |
|---|---|
| Hosting | Vercel serverless functions |
| Database | InsForge Postgres |
| Scheduler | cron-job.org |
| Email | nodemailer + Gmail SMTP |

### Endpoints

- `POST /api/webhook/lead` — form capture
- `POST /api/webhook/booking` — appointment capture

### Cron jobs

`process-followups` · `send-reminders` · `handle-no-shows`

### Surfaces

- `/book` — booking page, matched to the LandsandHousing brand
- `/admin` — dashboard, lead list with status filters

## Email templates

Seven: immediate response, follow-up 1, follow-up 2, follow-up 3, booking confirmation, appointment reminder, no-show reschedule.

## Note

Private working system, in production for a real client. Details on request.
