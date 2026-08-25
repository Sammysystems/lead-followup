import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail } from "../../src/lib/email.js";
import { noShowReschedule } from "../../src/lib/templates.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const { data: appointments, error: apptError } = await admin.database
      .from("appointment")
      .select("id, lead_id, date, time")
      .eq("status", "pending")
      .lt("date", todayStr);

    if (apptError) {
      console.error("Appointments query error:", apptError);
      return res.status(500).json({ error: "Failed to query appointments" });
    }

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ processed: 0, message: "No no-shows detected" });
    }

    let processed = 0;

    for (const appt of appointments) {
      await admin.database
        .from("appointment")
        .update({ status: "no_show" })
        .eq("id", appt.id);

      await admin.database
        .from("lead")
        .update({ status: "no_show", updated_at: now.toISOString() })
        .eq("id", appt.lead_id);

      const { data: lead } = await admin.database
        .from("lead")
        .select("name, email")
        .eq("id", appt.lead_id)
        .single();

      if (lead?.email) {
        try {
          const { subject, html } = noShowReschedule(lead.name);
          await sendEmail(lead.email, subject, html);

          await admin.database.from("emaillog").insert([{
            lead_id: appt.lead_id,
            type: "no_show_reschedule",
            subject,
            status: "sent",
          }]);
        } catch (emailErr) {
          console.error(`No-show email error for appointment ${appt.id}:`, emailErr);
        }
      }

      processed++;
    }

    return res.status(200).json({ processed });
  } catch (err) {
    console.error("Handle no-shows error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
