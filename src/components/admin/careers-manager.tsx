"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JobStatus, JobType } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOB_STATUSES, JOB_TYPES, JOB_TYPE_LABELS } from "@/lib/careers-data";
import { cn } from "@/lib/utils";

export type AdminJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: JobType;
  duration: string | null;
  experience: string | null;
  compensation: string | null;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
  exposureAreas: string[];
  status: JobStatus;
  order: number;
};

const SELECT_CLASS =
  "flex h-10 rounded-lg border border-navy-200 bg-white px-3 text-sm text-navy-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white";

const STATUS_BADGE: Record<JobStatus, "success" | "navy" | "outline"> = {
  OPEN: "success",
  CLOSED: "outline",
  DRAFT: "navy",
};

type JobFormState = {
  title: string;
  location: string;
  type: JobType;
  duration: string;
  experience: string;
  compensation: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  preferred: string;
  benefits: string;
  exposureAreas: string;
  status: JobStatus;
  order: string;
};

function emptyForm(): JobFormState {
  return {
    title: "",
    location: "Delhi NCR",
    type: "FULL_TIME",
    duration: "",
    experience: "",
    compensation: "",
    overview: "",
    responsibilities: "",
    requirements: "",
    preferred: "",
    benefits: "",
    exposureAreas: "",
    status: "OPEN",
    order: "0",
  };
}

function jobToForm(job: AdminJob): JobFormState {
  return {
    title: job.title,
    location: job.location,
    type: job.type,
    duration: job.duration ?? "",
    experience: job.experience ?? "",
    compensation: job.compensation ?? "",
    overview: job.overview,
    responsibilities: job.responsibilities.join("\n"),
    requirements: job.requirements.join("\n"),
    preferred: job.preferred.join("\n"),
    benefits: job.benefits.join("\n"),
    exposureAreas: job.exposureAreas.join("\n"),
    status: job.status,
    order: String(job.order),
  };
}

export function CareersManager({ initialJobs }: { initialJobs: AdminJob[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<JobFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startCreate() {
    setForm(emptyForm());
    setCreating(true);
    setEditingId(null);
  }

  function startEdit(job: AdminJob) {
    setForm(jobToForm(job));
    setEditingId(job.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
  }

  function update<K extends keyof JobFormState>(key: K, value: JobFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function saveJob() {
    if (form.title.trim().length < 2) {
      toast.error("Job title is required");
      return;
    }
    if (form.overview.trim().length < 10) {
      toast.error("Add a short overview (min 10 characters)");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      location: form.location,
      type: form.type,
      duration: form.duration || null,
      experience: form.experience || null,
      compensation: form.compensation || null,
      overview: form.overview,
      responsibilities: form.responsibilities,
      requirements: form.requirements,
      preferred: form.preferred,
      benefits: form.benefits,
      exposureAreas: form.exposureAreas,
      status: form.status,
      order: Number(form.order) || 0,
    };

    const url = editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(typeof json.error === "string" ? json.error : "Could not save job");
      return;
    }
    toast.success(editingId ? "Job updated" : "Job created");
    closeForm();
    router.refresh();
  }

  async function setJobStatus(job: AdminJob, status: JobStatus) {
    setBusyId(job.id);
    const res = await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not update status");
      return;
    }
    toast.success(`Job marked ${status.toLowerCase()}`);
    router.refresh();
  }

  async function deleteJob(job: AdminJob) {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(job.id);
    const res = await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      toast.error("Could not delete job");
      return;
    }
    toast.success("Job deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!creating && !editingId && (
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      )}

      {(creating || editingId) && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
              {editingId ? "Edit job" : "New job"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="j-title">Title *</Label>
              <Input
                id="j-title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-location">Location</Label>
              <Input
                id="j-location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-type">Type</Label>
              <select
                id="j-type"
                className={cn(SELECT_CLASS, "w-full")}
                value={form.type}
                onChange={(e) => update("type", e.target.value as JobType)}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-status">Status</Label>
              <select
                id="j-status"
                className={cn(SELECT_CLASS, "w-full")}
                value={form.status}
                onChange={(e) => update("status", e.target.value as JobStatus)}
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-duration">Duration</Label>
              <Input
                id="j-duration"
                placeholder="e.g. 3-6 Months"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-experience">Experience</Label>
              <Input
                id="j-experience"
                placeholder="e.g. 2-5 Years"
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-comp">Compensation</Label>
              <Input
                id="j-comp"
                placeholder="e.g. ₹8 LPA - ₹15 LPA"
                value={form.compensation}
                onChange={(e) => update("compensation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-order">Display order</Label>
              <Input
                id="j-order"
                type="number"
                value={form.order}
                onChange={(e) => update("order", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="j-overview">Overview *</Label>
            <Textarea
              id="j-overview"
              value={form.overview}
              onChange={(e) => update("overview", e.target.value)}
            />
          </div>

          <p className="mt-4 text-xs text-navy-500">
            For the lists below, enter one item per line.
          </p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="j-resp">Responsibilities</Label>
              <Textarea
                id="j-resp"
                value={form.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-req">Requirements</Label>
              <Textarea
                id="j-req"
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-pref">Preferred</Label>
              <Textarea
                id="j-pref"
                value={form.preferred}
                onChange={(e) => update("preferred", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-exp">Exposure areas</Label>
              <Textarea
                id="j-exp"
                value={form.exposureAreas}
                onChange={(e) => update("exposureAreas", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="j-ben">Benefits</Label>
              <Textarea
                id="j-ben"
                value={form.benefits}
                onChange={(e) => update("benefits", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveJob} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingId ? (
                "Save changes"
              ) : (
                "Create job"
              )}
            </Button>
          </div>
        </Card>
      )}

      {initialJobs.length === 0 && !creating ? (
        <p className="rounded-xl border border-navy-200 bg-navy-50 p-4 text-sm text-navy-600 dark:border-navy-800 dark:bg-navy-900/40">
          No jobs yet. Click &ldquo;Add job&rdquo; to create your first posting.
        </p>
      ) : (
        <div className="space-y-3">
          {initialJobs.map((job) => (
            <Card key={job.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-navy-900 dark:text-white">
                      {job.title}
                    </h3>
                    <Badge variant={STATUS_BADGE[job.status]}>{job.status}</Badge>
                    <Badge variant="navy">{JOB_TYPE_LABELS[job.type]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-navy-500">
                    {job.location}
                    {job.compensation ? ` · ${job.compensation}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(job)}
                    className="gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  {job.status === "OPEN" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === job.id}
                      onClick={() => setJobStatus(job, "CLOSED")}
                    >
                      Close
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === job.id}
                      onClick={() => setJobStatus(job, "OPEN")}
                    >
                      Reopen
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busyId === job.id}
                    onClick={() => deleteJob(job)}
                    className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
