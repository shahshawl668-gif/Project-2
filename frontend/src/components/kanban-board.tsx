"use client";

import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/types/job-tracker";

interface KanbanBoardProps {
  applications: Application[];
  onMove: (applicationId: string, nextStatus: ApplicationStatus) => void;
}

function DraggableCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-lg shadow-black/20 transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-100">{application.company_name}</h4>
          <p className="mt-1 text-sm text-slate-400">{application.role}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Match</p>
          <p className="text-sm font-semibold text-slate-100">
            {application.match_score !== null ? `${application.match_score}%` : "--"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{application.applied_date}</span>
        {application.reminders.needs_follow_up ? (
          <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-1 font-semibold text-amber-100">
            Follow up
          </span>
        ) : null}
      </div>
    </article>
  );
}

function Column({
  status,
  items,
}: {
  status: ApplicationStatus;
  items: Application[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-3xl border p-4 transition ${
        isOver
          ? "border-teal-400/40 bg-teal-500/10"
          : "border-white/10 bg-slate-900/60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-[0.15em] text-slate-300">{status}</h3>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.length ? (
          items.map((application) => (
            <DraggableCard key={application.id} application={application} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-500">
            Drop a card here
          </div>
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({ applications, onMove }: KanbanBoardProps) {
  function handleDragEnd(event: DragEndEvent) {
    const nextStatus = event.over?.id as ApplicationStatus | undefined;
    const applicationId = String(event.active.id);
    if (!nextStatus || !APPLICATION_STATUSES.includes(nextStatus)) return;

    const application = applications.find((item) => item.id === applicationId);
    if (!application || application.status === nextStatus) return;

    onMove(applicationId, nextStatus);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-5">
        {APPLICATION_STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            items={applications.filter((application) => application.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
