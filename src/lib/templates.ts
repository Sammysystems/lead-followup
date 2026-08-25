import { baseHtml } from "./email.js";

const BOOKING_URL = process.env.BOOKING_URL_BASE || "http://localhost:3000/book";

export function immediateResponse(name: string, topic: string) {
  const subject = "Thank you for reaching out — LandsandHousing";
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">Thank you for your interest in <strong>${topic}</strong>. A senior LandsandHousing property advisor will be in touch shortly.</p>
    <p style="margin:0 0 16px;">In the meantime, you can book a free consultation at a time that works for you:</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${BOOKING_URL}" style="display:inline-block; background:#B18A4A; color:#FFFFFF; padding:14px 32px; border-radius:9999px; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Book a Consultation</a>
    </div>
    <p style="margin:0 0 8px; font-size:12px; color:#625F58;">We look forward to helping you find the right property.</p>
    <p style="margin:0; font-size:12px; color:#625F58;"><strong>LandsandHousing</strong> · 181 Aka Road, Uyo</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function followUp1(name: string) {
  const subject = "Still looking for the right property?";
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">We noticed you recently reached out about our property advisory services. We'd love to help you find the right opportunity.</p>
    <p style="margin:0 0 16px;">Whether you're looking to buy, sell, or invest — our Uyo team has access to exclusive listings and deep market knowledge across Akwa Ibom.</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${BOOKING_URL}" style="display:inline-block; background:#B18A4A; color:#FFFFFF; padding:14px 32px; border-radius:9999px; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Book a Free Consultation</a>
    </div>
    <p style="margin:0; font-size:12px; color:#625F58;">No obligation — just a conversation about your property goals.</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function followUp2(name: string) {
  const subject = "We have properties matching your needs";
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">Since your last inquiry, we've listed several properties across Uyo's prime locations — from commercial spaces on Aka Road to residential estates in Shelter Afrique and Ewet Housing.</p>
    <p style="margin:0 0 16px;">Our advisors can walk you through options that match your budget and requirements.</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${BOOKING_URL}" style="display:inline-block; background:#B18A4A; color:#FFFFFF; padding:14px 32px; border-radius:9999px; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Schedule a Viewing</a>
    </div>
    <p style="margin:0; font-size:12px; color:#625F58;">LandsandHousing · 181 Aka Road, Uyo</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function followUp3(name: string) {
  const subject = "Last chance — free property consultation";
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">This is a final reminder that we're here to help with your property needs in Uyo and across Akwa Ibom.</p>
    <p style="margin:0 0 16px;">If you're still interested, we'd love to hear from you. If your plans have changed, no worries — we'll keep you updated on new listings that match your interests.</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${BOOKING_URL}" style="display:inline-block; background:#B18A4A; color:#FFFFFF; padding:14px 32px; border-radius:9999px; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Book a Call</a>
    </div>
    <p style="margin:0; font-size:12px; color:#625F58;">LandsandHousing · 0805 632 1856</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function bookingConfirmation(name: string, date: string, time: string) {
  const subject = `Your consultation is booked — ${date}`;
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">Your property consultation has been confirmed.</p>
    <div style="background:#F7F4EE; border:1px solid #DED7CA; border-radius:12px; padding:20px; margin:20px 0;">
      <p style="margin:0 0 8px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#B18A4A; font-weight:600;">Appointment Details</p>
      <p style="margin:0; font-size:16px; font-weight:600;"><strong>Date:</strong> ${date}</p>
      <p style="margin:4px 0 0; font-size:16px; font-weight:600;"><strong>Time:</strong> ${time}</p>
    </div>
    <p style="margin:0 0 16px;">Our advisor will contact you at the scheduled time. If you need to reschedule, please reply to this email or call us at 0805 632 1856.</p>
    <p style="margin:0; font-size:12px; color:#625F58;">LandsandHousing · 181 Aka Road, Uyo</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function appointmentReminder(name: string, date: string, time: string, hoursBefore: number) {
  const subject = hoursBefore <= 1
    ? `Reminder: Your consultation is in 1 hour`
    : `Reminder: Your consultation is tomorrow`;
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">This is a friendly reminder about your upcoming property consultation.</p>
    <div style="background:#F7F4EE; border:1px solid #DED7CA; border-radius:12px; padding:20px; margin:20px 0;">
      <p style="margin:0; font-size:16px; font-weight:600;"><strong>Date:</strong> ${date}</p>
      <p style="margin:4px 0 0; font-size:16px; font-weight:600;"><strong>Time:</strong> ${time}</p>
    </div>
    <p style="margin:0 0 16px;">Please be available at the scheduled time. If you need to reschedule, contact us at 0805 632 1856.</p>
    <p style="margin:0; font-size:12px; color:#625F58;">LandsandHousing · 181 Aka Road, Uyo</p>
  `;
  return { subject, html: baseHtml(body) };
}

export function noShowReschedule(name: string) {
  const subject = "We missed you — let's reschedule";
  const body = `
    <p style="margin:0 0 16px;">Dear ${name},</p>
    <p style="margin:0 0 16px;">We noticed you weren't able to make it to your scheduled consultation. We understand things come up.</p>
    <p style="margin:0 0 16px;">If you're still interested in our property advisory services, we'd love to find a new time that works for you.</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${BOOKING_URL}" style="display:inline-block; background:#B18A4A; color:#FFFFFF; padding:14px 32px; border-radius:9999px; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Reschedule Your Consultation</a>
    </div>
    <p style="margin:0; font-size:12px; color:#625F58;">LandsandHousing · 0805 632 1856</p>
  `;
  return { subject, html: baseHtml(body) };
}
