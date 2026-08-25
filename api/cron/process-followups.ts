import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";
import { sendEmail } from "../../src/lib/email.js";
import { followUp1, followUp2, followUp3 } from "../../src/lib/templates.js";

const FOLLOW_UPS = [
  { step: 1, hours: 1, template: followUp1 },
  { step: 2, hours: 24, template: followUp2 },
  { step: 3, hours: 72, template: followUp3 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data: leads, error: leadError } = await admin.database
      .from("lead")
      .select("id, name, email, created_at")
      .eq("status", "new")
      .not("email", "is", null)
      .order("created_at", { ascending: true })
      .limit(10);

    if (leadError) {
      console.error("Leads query error:", leadError);
      return res.status(500).json({ error: "Failed to query leads" });
    }

    if (!leads || leads.length === 0) {
      return res.status(200).json({ processed: 0, message: "No leads to follow up" });
    }

    let processed = 0;

    for (const lead of leads) {
      const leadCreatedAt = new Date(lead.created_at).getTime();
      const now = Date.now();
      const hoursSinceCreation = (now - leadCreatedAt) / (1000 * 60 * 60);

      const { data: existingFollowUps } = await admin.database
        .from("followup")
        .select("step")
        .eq("lead_id", lead.id)
        .eq("type", "follow_up");

      const completedSteps = existingFollowUps?.map((f) => f.step) || [];

      for (const followUp of FOLLOW_UPS) {
        if (completedSteps.includes(followUp.step)) continue;
        if (hoursSinceCreation < followUp.hours) continue;

        try {
          const { subject, html } = followUp.template(lead.name);
          await sendEmail(lead.email, subject, html);

          await admin.database.from("followup").insert([{
            lead_id: lead.id,
            step: followUp.step,
            type: "follow_up",
          }]);

          await admin.database.from("emaillog").insert([{
            lead_id: lead.id,
            type: `follow_up_${followUp.step}`,
            subject,
            status: "sent",
          }]);

          processed++;
          break;
        } catch (emailErr) {
          console.error(`Follow-up ${followUp.step} error for lead ${lead.id}:`, emailErr);
          await admin.database.from("emaillog").insert([{
            lead_id: lead.id,
            type: `follow_up_${followUp.step}`,
            subject: "Follow-up",
            status: "error",
            error: String(emailErr),
          }]);
        }
      }
    }

    return res.status(200).json({ processed });
  } catch (err) {
    console.error("Process follow-ups error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
