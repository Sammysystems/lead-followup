import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail } from "../../src/lib/email.js";
import { immediateResponse } from "../../src/lib/templates.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, topic, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    const { data: lead, error: insertError } = await admin.database
      .from("lead")
      .insert([{
        name,
        phone,
        email: email || null,
        topic: topic || null,
        message: message || null,
        status: "new",
        source: "website_form",
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return res.status(500).json({ error: "Failed to save lead" });
    }

    if (email) {
      try {
        const { subject, html } = immediateResponse(name, topic || "Property Advisory");
        await sendEmail(email, subject, html);

        await admin.database.from("emaillog").insert([{
          lead_id: lead.id,
          type: "immediate",
          subject,
          status: "sent",
        }]);
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        await admin.database.from("emaillog").insert([{
          lead_id: lead.id,
          type: "immediate",
          subject: "Thank you for reaching out",
          status: "error",
          error: String(emailErr),
        }]);
      }
    }

    return res.status(200).json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error("Lead webhook error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
