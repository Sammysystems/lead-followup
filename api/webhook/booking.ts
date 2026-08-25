import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail } from "../../src/lib/email.js";
import { bookingConfirmation } from "../../src/lib/templates.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, date, time } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ error: "Name, phone, date, and time are required" });
    }

    const { data: lead, error: leadError } = await admin.database
      .from("lead")
      .select("id")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let leadId: string;

    if (leadError || !lead) {
      const { data: newLead, error: newLeadError } = await admin.database
        .from("lead")
        .insert([{
          name,
          phone,
          email: email || null,
          status: "booked",
          source: "booking_page",
        }])
        .select()
        .single();

      if (newLeadError) {
        console.error("Lead insert error:", newLeadError);
        return res.status(500).json({ error: "Failed to create lead" });
      }
      leadId = newLead.id;
    } else {
      leadId = lead.id;
      await admin.database
        .from("lead")
        .update({ status: "booked", updated_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    const { error: apptError } = await admin.database
      .from("appointment")
      .insert([{
        lead_id: leadId,
        date,
        time,
        status: "pending",
      }]);

    if (apptError) {
      console.error("Appointment insert error:", apptError);
      return res.status(500).json({ error: "Failed to create appointment" });
    }

    await admin.database
      .from("followup")
      .delete()
      .eq("lead_id", leadId)
      .eq("type", "follow_up");

    if (email) {
      try {
        const { subject, html } = bookingConfirmation(name, date, time);
        await sendEmail(email, subject, html);

        await admin.database.from("emaillog").insert([{
          lead_id: leadId,
          type: "confirmation",
          subject,
          status: "sent",
        }]);
      } catch (emailErr) {
        console.error("Confirmation email error:", emailErr);
      }
    }

    return res.status(200).json({ ok: true, leadId, appointment: { date, time } });
  } catch (err) {
    console.error("Booking webhook error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
