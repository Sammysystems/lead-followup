import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

const FROM = process.env.EMAIL_FROM || process.env.SMTP_USER!;

export async function sendEmail(to: string, subject: string, html: string) {
  return getTransporter().sendMail({ from: FROM, to, subject, html });
}

export function baseHtml(body: string): string {
  const content = body.replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:1.6; color:#171716; background:#F7F4EE; margin:0; padding:0;">
    <div style="max-width:600px; margin:0 auto; padding:40px 24px;">
      <div style="text-align:center; margin-bottom:32px;">
        <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size:20px; font-weight:600; color:#171716; margin:0;">LandsandHousing</h1>
        <p style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#B18A4A; margin:4px 0 0;">Property Advisory & Real Estate</p>
      </div>
      <div style="background:#FFFFFF; border:1px solid #DED7CA; border-radius:16px; padding:32px 28px;">
${content}
      </div>
      <div style="text-align:center; margin-top:24px; font-size:11px; color:#625F58;">
        <p>181 Aka Road, Uyo 520001, Akwa Ibom, Nigeria</p>
        <p>0805 632 1856 · <a href="https://wa.me/2348056321856" style="color:#B18A4A; text-decoration:none;">WhatsApp</a></p>
      </div>
    </div>
  </body>
</html>`;
}
