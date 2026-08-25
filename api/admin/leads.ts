import type { VercelRequest, VercelResponse } from "@vercel/node";
import { admin } from "../../src/lib/insforge.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { status, page = "1", limit = "20" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = admin.database
      .from("lead")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Leads query error:", error);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }

    return res.status(200).json({ leads: data, total: count });
  } catch (err) {
    console.error("Admin leads error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
