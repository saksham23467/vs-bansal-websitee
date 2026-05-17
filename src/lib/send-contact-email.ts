import nodemailer from "nodemailer";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL?.trim() || siteConfig.email;

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
};

function buildEmailContent(data: ContactEmailPayload) {
  const subject = `New website enquiry: ${data.name}`;
  const text = [
    "New message from the V S bansal & associates website contact form.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? "—"}`,
    `Service: ${data.service ?? "—"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  return { subject, text };
}

async function sendViaResend(data: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { subject, text } = buildEmailContent(data);
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from:
      process.env.RESEND_FROM ??
      "V S bansal & associates <onboarding@resend.dev>",
    to: [NOTIFY_EMAIL],
    replyTo: data.email,
    subject,
    text,
  });
  return true;
}

async function sendViaSmtp(data: ContactEmailPayload) {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return false;

  const { subject, text } = buildEmailContent(data);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM?.trim() ||
      `V S bansal & associates <${user}>`,
    to: NOTIFY_EMAIL,
    replyTo: data.email,
    subject,
    text,
  });
  return true;
}

/** Sends contact form notification to the firm inbox (default: vsbansalassociates@gmail.com). */
export async function sendContactNotification(
  data: ContactEmailPayload
): Promise<{ sent: boolean; via?: "resend" | "smtp" }> {
  try {
    if (await sendViaResend(data)) {
      return { sent: true, via: "resend" };
    }
    if (await sendViaSmtp(data)) {
      return { sent: true, via: "smtp" };
    }
    console.warn(
      `[contact] Email not sent to ${NOTIFY_EMAIL}. Set RESEND_API_KEY or SMTP_USER + SMTP_PASS on Vercel.`
    );
    return { sent: false };
  } catch (error) {
    console.error("[contact] Email delivery failed:", error);
    return { sent: false };
  }
}
