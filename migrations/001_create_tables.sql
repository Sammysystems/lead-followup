-- Lead Follow-Up & Appointment Recovery System
-- LandsandHousing, Uyo

-- Leads table
CREATE TABLE IF NOT EXISTS "Lead" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  topic TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website_form',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS "Appointment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lead_id TEXT NOT NULL REFERENCES "Lead"(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Follow-ups table
CREATE TABLE IF NOT EXISTS "FollowUp" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lead_id TEXT NOT NULL REFERENCES "Lead"(id),
  step INTEGER NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL
);

-- Email log table
CREATE TABLE IF NOT EXISTS "EmailLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lead_id TEXT NOT NULL REFERENCES "Lead"(id),
  type TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lead_status ON "Lead"(status);
CREATE INDEX IF NOT EXISTS idx_lead_email ON "Lead"(email);
CREATE INDEX IF NOT EXISTS idx_lead_phone ON "Lead"(phone);
CREATE INDEX IF NOT EXISTS idx_appointment_lead ON "Appointment"(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointment_status ON "Appointment"(status);
CREATE INDEX IF NOT EXISTS idx_appointment_date ON "Appointment"(date);
CREATE INDEX IF NOT EXISTS idx_followup_lead ON "FollowUp"(lead_id);
CREATE INDEX IF NOT EXISTS idx_emaillog_lead ON "EmailLog"(lead_id);
