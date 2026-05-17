import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/send-contact-email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Please add a short message (10+ characters)"),
});

function contactErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Database is not connected. Add DATABASE_URL on Vercel and run prisma db push.";
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021" || error.code === "P1001") {
      return "Database tables are missing. Run: npx prisma db push";
    }
  }
  return "Could not save your message. Please call or WhatsApp us directly.";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const honeypot = req.headers.get("x-company-url");
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, phone, service, message } = parsed.data;

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
        source: "website",
      },
    });
  } catch (error) {
    console.error("Contact form DB error:", error);
    return NextResponse.json(
      { error: contactErrorMessage(error) },
      { status: 503 }
    );
  }

  const mail = await sendContactNotification({
    name,
    email,
    phone,
    service,
    message,
  });

  return NextResponse.json({ ok: true, id: lead.id, emailSent: mail.sent });
}
