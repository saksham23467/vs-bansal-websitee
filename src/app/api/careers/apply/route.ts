import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeFileName } from "@/lib/documents";
import { MAX_RESUME_BYTES } from "@/lib/careers-data";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/send-contact-email";

export const runtime = "nodejs";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  location: z.string().min(2, "Enter your current location").max(120),
  positionTitle: z.string().min(2).max(160),
  qualification: z.string().min(2, "Select your qualification").max(120),
  experience: z.string().max(120).optional().nullable(),
  linkedin: z.string().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  coverLetter: z.string().max(4000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(`careers-apply:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many applications. Please try again in a minute." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    positionTitle: formData.get("positionTitle"),
    qualification: formData.get("qualification"),
    experience: formData.get("experience") || null,
    linkedin: formData.get("linkedin") || "",
    coverLetter: formData.get("coverLetter") || "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please attach your resume (PDF)" }, { status: 400 });
  }
  if (file.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ error: "Resume must be 5MB or smaller" }, { status: 400 });
  }
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ error: "Resume must be a PDF file" }, { status: 400 });
  }

  const data = parsed.data;
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(
    file.name.toLowerCase().endsWith(".pdf") ? file.name : `${file.name}.pdf`
  );
  const resumeFileName = `${sanitizeFileName(data.fullName)}-resume.pdf` || safeName;

  const result = await sendContactNotification({
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    service: `Career application — ${data.positionTitle}`,
    subject: `New job application: ${data.positionTitle} — ${data.fullName}`,
    message: [
      `New job application received via the careers page.`,
      "",
      `Position: ${data.positionTitle}`,
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Location: ${data.location}`,
      `Qualification: ${data.qualification}`,
      `Experience: ${data.experience || "—"}`,
      `LinkedIn: ${data.linkedin || "—"}`,
      "",
      "Cover letter:",
      data.coverLetter || "—",
      "",
      "The candidate's resume is attached to this email as a PDF.",
    ].join("\n"),
    attachments: [
      { filename: resumeFileName, content: buffer, contentType: "application/pdf" },
    ],
  });

  if (!result.sent) {
    console.error("[careers] Application email could not be sent.");
    return NextResponse.json(
      { error: "Could not submit your application. Please try again or email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
