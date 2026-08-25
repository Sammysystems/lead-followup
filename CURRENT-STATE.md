# CURRENT STATE — Lead Follow-Up System

## Status: DEPLOYED ✅

## What Was Built

### 1. Lead Follow-Up & Appointment Recovery System
- **Business:** LandsandHousing — Property Advisory & Real Estate, Uyo
- **Stack:** Vercel + InsForge Postgres + cron-job.org + nodemailer
- **Project folder:** `C:\Users\USER\Desktop\lead-followup\`

### 2. Core Components
- **Webhooks:** `/api/webhook/lead` (form capture), `/api/webhook/booking` (appointment)
- **Cron jobs:** `process-followups`, `send-reminders`, `handle-no-shows`
- **Booking page:** `/book` — matches LandsandHousing design (gold, cream, serif fonts)
- **Dashboard:** `/admin` — lead list with status filters

### 3. Email Templates (7 types)
- Immediate response, follow-up 1/2/3, booking confirmation, appointment reminder, no-show reschedule

### 4. Landing Page Modified
- AdvisorModal updated to POST to webhook on form submit
- Webhook URL: `https://lead-followup-tau.vercel.app/api/webhook/lead`

### 5. Database Tables
- lead, appointment, followup, emaillog (SQL migrations applied to InsForge)

## Live URLs

| Endpoint | URL |
|----------|-----|
| Production | https://lead-followup-tau.vercel.app |
| Lead Webhook | POST https://lead-followup-tau.vercel.app/api/webhook/lead |
| Booking Webhook | POST https://lead-followup-tau.vercel.app/api/webhook/booking |
| Follow-up Cron | GET https://lead-followup-tau.vercel.app/api/cron/process-followups |
| Reminder Cron | GET https://lead-followup-tau.vercel.app/api/cron/send-reminders |
| No-Show Cron | GET https://lead-followup-tau.vercel.app/api/cron/handle-no-shows |
| Admin Dashboard | https://lead-followup-tau.vercel.app/admin |
| Booking Page | https://lead-followup-tau.vercel.app/book |

## What's Left

### Cron-Job.org Setup (Manual)
Create 3 jobs at https://console.cron-job.org:

1. **Process Follow-ups** — Every 30 min, GET `https://lead-followup-tau.vercel.app/api/cron/process-followups`
2. **Send Reminders** — Every hour (at minute 0), GET `https://lead-followup-tau.vercel.app/api/cron/send-reminders`
3. **Handle No-Shows** — Every hour (at minute 30), GET `https://lead-followup-tau.vercel.app/api/cron/handle-no-shows`

## File Locations

| File | Path |
|------|------|
| Lead webhook | `lead-followup/api/webhook/lead.ts` |
| Booking webhook | `lead-followup/api/webhook/booking.ts` |
| Follow-up cron | `lead-followup/api/cron/process-followups.ts` |
| Reminder cron | `lead-followup/api/cron/send-reminders.ts` |
| No-show cron | `lead-followup/api/cron/handle-no-shows.ts` |
| Email templates | `lead-followup/src/lib/templates.ts` |
| Booking page | `lead-followup/book/index.html` |
| Dashboard | `lead-followup/admin/index.html` |
| SQL migrations | `lead-followup/migrations/001_create_tables.sql` |
| AdvisorModal | `landsandhousing.../src/components/AdvisorModal.tsx` |
