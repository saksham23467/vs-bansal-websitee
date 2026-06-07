"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_RESUME_BYTES, QUALIFICATION_OPTIONS } from "@/lib/careers-data";
import { cn } from "@/lib/utils";

const SELECT_CLASS =
  "flex h-11 w-full rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm text-navy-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  location: z.string().min(2, "Enter your current location"),
  positionTitle: z.string().min(2, "Select the position"),
  qualification: z.string().min(2, "Select your qualification"),
  experience: z.string().optional(),
  linkedin: z
    .string()
    .url("Enter a valid URL (https://…)")
    .optional()
    .or(z.literal("")),
  coverLetter: z.string().optional(),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export type ApplyPosition = { id: string; title: string };

type ApplicationModalProps = {
  open: boolean;
  onClose: () => void;
  positions: ApplyPosition[];
  initialPositionTitle?: string;
};

export function ApplicationModal({
  open,
  onClose,
  positions,
  initialPositionTitle,
}: ApplicationModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      positionTitle: initialPositionTitle ?? positions[0]?.title ?? "",
      qualification: "",
      experience: "",
      linkedin: "",
      coverLetter: "",
    },
  });

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setResumeFile(null);
      setResumeError(null);
      reset({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        positionTitle: initialPositionTitle ?? positions[0]?.title ?? "",
        qualification: "",
        experience: "",
        linkedin: "",
        coverLetter: "",
      });
    }
  }, [open, initialPositionTitle, positions, reset]);

  useEffect(() => {
    if (initialPositionTitle) {
      setValue("positionTitle", initialPositionTitle);
    }
  }, [initialPositionTitle, setValue]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleFile(file: File | null) {
    if (!file) {
      setResumeFile(null);
      return;
    }
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setResumeError("Resume must be a PDF file");
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("Resume must be 5MB or smaller");
      setResumeFile(null);
      return;
    }
    setResumeError(null);
    setResumeFile(file);
  }

  async function onSubmit(values: ApplicationValues) {
    if (!resumeFile) {
      setResumeError("Please attach your resume (PDF)");
      return;
    }

    const fd = new FormData();
    fd.append("fullName", values.fullName);
    fd.append("email", values.email);
    fd.append("phone", values.phone);
    fd.append("location", values.location);
    fd.append("positionTitle", values.positionTitle);
    const matchedJob = positions.find((p) => p.title === values.positionTitle);
    if (matchedJob) fd.append("jobId", matchedJob.id);
    fd.append("qualification", values.qualification);
    fd.append("experience", values.experience ?? "");
    fd.append("linkedin", values.linkedin ?? "");
    fd.append("coverLetter", values.coverLetter ?? "");
    fd.append("resume", resumeFile);

    const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(typeof json.error === "string" ? json.error : "Something went wrong");
      return;
    }
    setSubmitted(true);
    toast.success("Application submitted — thank you!");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Job application form"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-8 w-full max-w-2xl rounded-2xl border border-navy-200 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-navy-500 transition-colors hover:bg-navy-100 hover:text-navy-900 dark:hover:bg-navy-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center px-8 py-16 text-center">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">
                  Application received
                </h3>
                <p className="mt-2 max-w-md text-navy-600 dark:text-navy-300">
                  Thank you for applying. Our team will review your profile and
                  reach out if there&apos;s a match. Good luck!
                </p>
                <Button className="mt-6" onClick={onClose}>
                  Done
                </Button>
              </div>
            ) : (
              <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
                  Apply now
                </h3>
                <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
                  Fill in your details below. Fields marked * are required.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input id="fullName" placeholder="Your name" {...register("fullName")} />
                      {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number *</Label>
                      <Input id="phone" type="tel" placeholder="+91 …" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Current location *</Label>
                      <Input id="location" placeholder="City, State" {...register("location")} />
                      {errors.location && (
                        <p className="text-sm text-red-600">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="positionTitle">Position applied for *</Label>
                      <select id="positionTitle" className={SELECT_CLASS} {...register("positionTitle")}>
                        {positions.length === 0 && <option value="">No open roles</option>}
                        {positions.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                      {errors.positionTitle && (
                        <p className="text-sm text-red-600">{errors.positionTitle.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Current qualification *</Label>
                      <select id="qualification" className={SELECT_CLASS} {...register("qualification")}>
                        <option value="">Select qualification</option>
                        {QUALIFICATION_OPTIONS.map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                      {errors.qualification && (
                        <p className="text-sm text-red-600">{errors.qualification.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        placeholder="e.g. Fresher, 2 years"
                        {...register("experience")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn profile</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/…"
                        {...register("linkedin")}
                      />
                      {errors.linkedin && (
                        <p className="text-sm text-red-600">{errors.linkedin.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume (PDF) *</Label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border border-dashed border-navy-300 bg-navy-50 px-4 py-4 text-left text-sm transition-colors hover:border-royal-500 hover:bg-royal-50 dark:border-navy-700 dark:bg-navy-800/40 dark:hover:bg-navy-800",
                        resumeFile && "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                      )}
                    >
                      <UploadCloud className="h-5 w-5 shrink-0 text-royal-600" />
                      <span className="truncate text-navy-700 dark:text-navy-200">
                        {resumeFile ? resumeFile.name : "Click to upload your resume (PDF, max 5MB)"}
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      id="resume"
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    {resumeError && <p className="text-sm text-red-600">{resumeError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you'd be a great fit…"
                      {...register("coverLetter")}
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit application"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
