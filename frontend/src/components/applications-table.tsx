"use client";

import type { Application } from "@/types/job-tracker";

interface ApplicationsTableProps {
  applications: Application[];
  onDelete: (id: string) => void;
}

export function ApplicationsTable({
  applications,
  onDelete,
}: ApplicationsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-lg shadow-black/20">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr className="text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            <th className="px-5 py-4">Company</th>
            <th className="px-5 py-4">Role</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Applied</th>
            <th className="px-5 py-4">Match</th>
            <th className="px-5 py-4">Reminders</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-transparent">
          {applications.map((application) => (
            <tr key={application.id} className="text-sm text-slate-300 transition hover:bg-white/[0.03]">
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-100">
                  {application.company_name}
                </div>
                {application.job_link ? (
                  <a
                    href={application.job_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-300"
                  >
                    View posting
                  </a>
                ) : null}
              </td>
              <td className="px-5 py-4">{application.role}</td>
              <td className="px-5 py-4">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {application.status}
                </span>
              </td>
              <td className="px-5 py-4">{application.applied_date}</td>
              <td className="px-5 py-4">
                {application.match_score !== null ? `${application.match_score}%` : "Pending"}
              </td>
              <td className="px-5 py-4">
                {application.reminders.needs_follow_up ? (
                  <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">
                    Follow up due
                  </span>
                ) : application.reminders.needs_interview_reminder ? (
                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-100">
                    Interview soon
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">No active reminders</span>
                )}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onDelete(application.id)}
                  className="rounded-2xl border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
