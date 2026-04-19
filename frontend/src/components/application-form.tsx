"use client";

import { useMemo, useState } from "react";

import { analyzeResumeMatch, ApiError, createApplication } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationPayload,
  type MatchAnalysis,
} from "@/types/job-tracker";

const initialFormState: ApplicationPayload = {
  company_name: "",
  role: "",
  job_link: "",
  job_description: "",
  resume_text: "",
  applied_date: new Date().toISOString().slice(0, 10),
  interview_date: null,
  status: "APPLIED",
  match_score: null,
};

interface ApplicationFormProps {
  onCreated?: (application: Application) => void;
}

export function ApplicationForm({ onCreated }: ApplicationFormProps) {
  const token = useAuthStore((state) => state.token);
  const [form, setForm] = useState<ApplicationPayload>(initialFormState);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = useMemo(
    () => Boolean(form.job_description?.trim() && form.resume_text?.trim()),
    [form.job_description, form.resume_text],
  );

  function updateField<Key extends keyof ApplicationPayload>(
    field: Key,
    value: ApplicationPayload[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAnalyze() {
    if (!token || !canAnalyze) return;

    setError(null);
    setMessage(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeResumeMatch(
        token,
        form.job_description ?? "",
        form.resume_text ?? "",
      );
      setAnalysis(result);
      updateField("match_score", result.match_score);
      setMessage("AI analysis completed and match score applied to the form.");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to analyze the resume match.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const created = await createApplication(token, {
        ...form,
        job_link: form.job_link || null,
        job_description: form.job_description || null,
        resume_text: form.resume_text || null,
        interview_date: form.interview_date || null,
      });
      setForm(initialFormState);
      setAnalysis(null);
      setMessage("Application saved successfully.");
      onCreated?.(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save the application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-lg shadow-black/20"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Company name</span>
            <input
              required
              value={form.company_name}
              onChange={(event) => updateField("company_name", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Role</span>
            <input
              required
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Job link</span>
            <input
              type="url"
              value={form.job_link ?? ""}
              onChange={(event) => updateField("job_link", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400"
              placeholder="https://company.com/jobs/123"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Applied date</span>
            <input
              required
              type="date"
              value={form.applied_date}
              onChange={(event) => updateField("applied_date", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value as ApplicationPayload["status"])
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Interview date</span>
            <input
              type="datetime-local"
              value={form.interview_date ?? ""}
              onChange={(event) => updateField("interview_date", event.target.value || null)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Job description</span>
          <textarea
            rows={6}
            value={form.job_description ?? ""}
            onChange={(event) => updateField("job_description", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Resume text</span>
          <textarea
            rows={6}
            value={form.resume_text ?? ""}
            onChange={(event) => updateField("resume_text", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="rounded-2xl border border-teal-400/25 bg-teal-500/10 px-4 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze match"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:from-teal-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save application"}
          </button>
        </div>

        {message ? (
          <div className="rounded-2xl border border-teal-400/25 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </form>

      <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20">
        <h3 className="text-lg font-semibold text-white">AI match summary</h3>
        <p className="mt-2 text-sm text-slate-400">
          Run the resume matcher before saving to prefill a match score and surface missing keywords.
        </p>

        {analysis ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-sm text-slate-400">Match score</p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {analysis.match_score}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-sm font-medium text-slate-200">Missing keywords</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.missing_keywords.length ? (
                  analysis.missing_keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No major gaps detected.</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-sm font-medium text-slate-200">Suggestions</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {analysis.improvement_suggestions.map((suggestion) => (
                  <li key={suggestion}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-slate-400">
            Add a job description and resume text to generate AI feedback.
          </div>
        )}
      </aside>
    </div>
  );
}
