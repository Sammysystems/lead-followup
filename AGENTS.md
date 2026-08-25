# Lead Follow-Up & Appointment Recovery System — LandsandHousing

## Project
Lead capture → follow-up → booking → reminder → no-show recovery for LandsandHousing (Real Estate, Uyo).

## Stack
- **Backend:** Vercel Serverless Functions (TypeScript)
- **Database:** InsForge Postgres
- **Email:** Nodemailer + SMTP
- **Notifications:** ntfy.sh
- **Scheduler:** cron-job.org (external)

## Architecture

### Webhooks
- `POST /api/webhook/lead` — Form submission → save lead → send immediate response
- `POST /api/webhook/booking` — Booking made → create appointment → stop follow-ups → send confirmation

### Cron Jobs
- `GET /api/cron/process-followups` — Every 30 min → follow-up emails to unbooked leads
- `GET /api/cron/send-reminders` — Every hour → appointment reminders
- `GET /api/cron/handle-no-shows` — Every hour → detect no-shows → reschedule email

### Pages
- `/book` — Custom booking page (matches LandsandHousing design)
- `/admin` — Lead dashboard

### Data Model
- `Lead` — id, name, email, phone, topic, message, status, source, created_at, updated_at
- `Appointment` — id, lead_id, date, time, status, reminder_sent
- `FollowUp` — id, lead_id, step, sent_at, type
- `EmailLog` — id, lead_id, type, subject, status, error, created_at

### Lead Status Pipeline
```
new → responded → booked → confirmed → attended
                                 ↓
                           no_show → rescheduled → attended
                                              or → lost
```

## Env Vars
```
INSFORGE_URL=
INSFORGE_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
NTFY_TOPIC=
BOOKING_URL_BASE=
BUSINESS_HOURS_START=9
BUSINESS_HOURS_END=17
BUSINESS_DAYS=mon,tue,wed,thu,fri
TIMEZONE=Africa/Lagos
```

## Deploy
1. ✅ Apply SQL migrations to InsForge
2. ✅ Set env vars in Vercel
3. ✅ `cd lead-followup && npx vercel --prod`
4. Create 3 cron-job.org jobs pointing to cron endpoints (see below)
5. ✅ Update AdvisorModal webhook URL in landing page
6. ✅ Test each endpoint

## Live URLs
- **Production:** https://lead-followup-tau.vercel.app
- **Lead Webhook:** POST https://lead-followup-tau.vercel.app/api/webhook/lead
- **Booking Webhook:** POST https://lead-followup-tau.vercel.app/api/webhook/booking
- **Follow-up Cron:** GET https://lead-followup-tau.vercel.app/api/cron/process-followups
- **Reminder Cron:** GET https://lead-followup-tau.vercel.app/api/cron/send-reminders
- **No-Show Cron:** GET https://lead-followup-tau.vercel.app/api/cron/handle-no-shows
- **Admin Dashboard:** https://lead-followup-tau.vercel.app/admin
- **Booking Page:** https://lead-followup-tau.vercel.app/book

## Cron-Job.org Setup
Create 3 jobs at https://console.cron-job.org:

### Job 1: Process Follow-ups
- **URL:** `https://lead-followup-tau.vercel.app/api/cron/process-followups`
- **Schedule:** Every 30 minutes
- **Method:** GET

### Job 2: Send Reminders
- **URL:** `https://lead-followup-tau.vercel.app/api/cron/send-reminders`
- **Schedule:** Every hour (at minute 0)
- **Method:** GET

### Job 3: Handle No-Shows
- **URL:** `https://lead-followup-tau.vercel.app/api/cron/handle-no-shows`
- **Schedule:** Every hour (at minute 30)
- **Method:** GET
