import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail } from "../../src/lib/email.js";
import { appointmentReminder } from "../../src/lib/templates.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const todayStr = now.toISOString().split("T")[0];

    const { data: appointments, error: apptError } = await admin.database
      .from("appointment")
      .select("id, lead_id, date, time, reminder_sent")
      .in("status", ["pending", "confirmed"])
      .in("date", [todayStr, tomorrowStr]);

    if (apptError) {
      console.error("Appointments query error:", apptError);
      return res.status(500).json({ error: "Failed to query appointments" });
    }

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ processed: 0, message: "No upcoming appointments" });
    }

    let processed = 0;

    for (const appt of appointments) {
      if (appt.reminder_sent) continue;

      const { data: lead } = await admin.database
        .from("lead")
        .select("name, email")
        .eq("id", appt.lead_id)
        .single();

      if (!lead || !lead.email) continue;

      const isToday = appt.date === todayStr;
      const hoursBefore = isToday ? 1 : 24;

      try {
        const { subject, html } = appointmentReminder(lead.name, appt.date, appt.time, hoursBefore);
        await sendEmail(lead.email, subject, html);

        await admin.database
          .from("appointment")
          .update({ reminder_sent: true })
          .eq("id", appt.id);

        await admin.database.from("emaillog").insert([{
          lead_id: appt.lead_id,
          type: "reminder",
          subject,
          status: "sent",
        }]);

        processed++;
      } catch (emailErr) {
        console.error(`Reminder error for appointment ${appt.id}:`, emailErr);
      }
    }

    return res.status(200).json({ processed });
  } catch (err) {
    console.error("Send reminders error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
