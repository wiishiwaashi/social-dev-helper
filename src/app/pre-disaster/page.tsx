"use client";

import { gaps, resources, lgu } from "@/lib/data";
import type { Gap } from "@/lib/data";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const severityConfig = {
  critical: { label: "Critical", color: "bg-red-100 text-red-600", bar: "bg-red-400" },
  moderate: { label: "Moderate", color: "bg-amber-100 text-amber-600", bar: "bg-amber-400" },
  low: { label: "Low", color: "bg-gray-100 text-gray-500", bar: "bg-gray-300" },
};

const statusConfig = {
  open: { label: "Open", icon: AlertTriangle, color: "text-red-400" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-amber-400" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-green-500" },
};

const CARD = "bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

const postDisasterUpdates = [
  "G001: Nighttime evacuation protocol delayed field decisions during Typhoon Carina.",
  "G002: Life jacket shortages were confirmed as a direct rescue safety risk.",
  "G003: Radio interference showed the need for a backup communication tree.",
];

const gapChecklists: Record<string, string[]> = {
  G001: [
    "Confirm nighttime evacuation route captains",
    "Assign buddy-system marshals per purok",
    "Schedule barangay drill and radio check",
  ],
  G002: [
    "Validate current life jacket count",
    "Prepare procurement or OCD-NCR request",
    "Set minimum stock threshold alert",
  ],
  G003: [
    "Create SMS contact tree for barangay captains",
    "Test backup channel during EOC briefing",
    "Document fallback communication protocol",
  ],
  G004: [
    "List BDRRMC members without first aid training",
    "Coordinate training date with Red Cross",
    "Record attendance in compliance log",
  ],
  G005: [
    "Inspect candidate overflow centers",
    "Confirm capacity and sanitation readiness",
    "Publish activation criteria to barangays",
  ],
  G006: [
    "Verify siren installation status",
    "Run community warning test",
    "Archive completion evidence",
  ],
};

export default function PreDisasterPage() {
  return (
    <Suspense fallback={<main className="p-6 min-h-screen" />}>
      <PreDisasterContent />
    </Suspense>
  );
}

function PreDisasterContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Gap | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "moderate" | "low">("all");
  const [dismissedPostUpdates, setDismissedPostUpdates] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});
  const showPostUpdates = searchParams.get("updated") === "post" && !dismissedPostUpdates;

  const criticalCount = gaps.filter((g) => g.severity === "critical" && g.status !== "resolved").length;
  const resolvedCount = gaps.filter((g) => g.status === "resolved").length;
  const openCount = gaps.filter((g) => g.status === "open").length;
  const complianceScore = Math.round((resolvedCount / gaps.length) * 100);

  const filtered = filter === "all" ? gaps : gaps.filter((g) => g.severity === filter);
  const activeFilterLabel = filter === "all" ? "All gaps" : `${severityConfig[filter].label} gaps`;

  const handleFilterChange = (nextFilter: typeof filter) => {
    setFilter(nextFilter);
    setSelected(null);
  };

  const toggleChecklistItem = (gapId: string, item: string) => {
    setCheckedItems((prev) => {
      const current = prev[gapId] ?? [];
      const nextItems = current.includes(item)
        ? current.filter((checked) => checked !== item)
        : [...current, item];
      return { ...prev, [gapId]: nextItems };
    });
  };

  const resourceReadiness = Math.round(
    resources.reduce((sum, r) => sum + r.available / r.total, 0) / resources.length * 100
  );

  return (
    <main className="p-6 space-y-5 min-h-screen">
      {/* Alert Banner */}
      <div className={`${CARD} px-6 py-4 flex items-center gap-3 border-l-4 border-red-500`}>
        <div className="w-2 h-2 rounded-[7px] bg-red-500 animate-pulse shrink-0" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500 mb-0.5">Active Disaster</p>
          <p className="text-sm font-medium text-gray-800">
            {lgu.activeDisaster} — {lgu.alertLabel} declared for {lgu.name}
          </p>
        </div>
        <Link
          href="/during-disaster"
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-[#323030] text-white px-3 py-1.5 rounded-[7px] hover:bg-[#1a1818] transition-colors"
        >
          Response Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          <span>Overview</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">Pre-Disaster</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {lgu.name} · NCR · City DRRM Office
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Preparedness & Gap Analysis</h1>
          </div>
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-[7px] hover:bg-gray-50 transition-colors">
            <FileDown className="w-3.5 h-3.5" />
            Export Compliance Report
          </button>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Compliance Score", value: `${complianceScore}%`, sub: `${resolvedCount} of ${gaps.length} gaps resolved` },
          { label: "Critical Gaps", value: String(criticalCount), sub: "Require immediate action" },
          { label: "Open Items", value: String(openCount), sub: "Awaiting resolution" },
          { label: "Resource Readiness", value: `${resourceReadiness}%`, sub: "Avg across all resource types" },
        ].map((s) => (
          <div key={s.label} className={`${CARD} px-5 py-5`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {showPostUpdates && (
        <div className={`${CARD} px-6 py-4 border-l-4 border-amber-400`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">
                Updated From Post-Disaster Debrief
              </p>
              <h2 className="text-sm font-bold text-gray-900 mb-2">Gap analysis refreshed with incident lessons</h2>
              <div className="grid grid-cols-3 gap-3">
                {postDisasterUpdates.map((update) => (
                  <p key={update} className="rounded-[7px] bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                    {update}
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setDismissedPostUpdates(true)}
              className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Gap List */}
        <div id="gap-analysis" className={`col-span-2 ${CARD} overflow-hidden scroll-mt-6`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">DRRM Gap Analysis</h2>
            </div>
            <div className="flex items-center gap-1">
              {(["all", "critical", "moderate", "low"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-[7px] transition-colors ${
                    filter === f ? "bg-[#323030] text-white" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((g) => {
              const sev = severityConfig[g.severity];
              const stat = statusConfig[g.status];
              const StatusIcon = stat.icon;
              return (
                <div
                  key={g.id}
                  id={g.id}
                  onClick={() => setSelected(selected?.id === g.id ? null : g)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors scroll-mt-6 ${
                    showPostUpdates && ["G001", "G002", "G003"].includes(g.id) ? "bg-amber-50/70" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${stat.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-gray-900">{g.description}</p>
                      </div>
                      <p className="text-[10px] text-gray-400">{g.category} · {g.id}</p>
                      {showPostUpdates && ["G001", "G002", "G003"].includes(g.id) && (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                          Updated from debrief
                        </p>
                      )}
                      {selected?.id === g.id && (
                        <div className="mt-3 bg-gray-50 rounded-[7px] px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Recommended Action</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{g.recommendedAction}</p>
                          <div className="mt-4 border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                Action Checklist
                              </p>
                              <span className="text-[10px] font-semibold text-gray-400">
                                {(checkedItems[g.id] ?? []).length}/{gapChecklists[g.id]?.length ?? 0} done
                              </span>
                            </div>
                            <div className="space-y-2">
                              {(gapChecklists[g.id] ?? []).map((item) => {
                                const checked = (checkedItems[g.id] ?? []).includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={(event) => event.stopPropagation()}
                                    className="flex items-start gap-2 rounded-[7px] bg-white px-3 py-2 text-xs text-gray-700"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleChecklistItem(g.id, item)}
                                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 accent-[#323030]"
                                    />
                                    <span className={checked ? "text-gray-400 line-through" : ""}>{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-[7px] ${sev.color}`}>
                      {sev.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Compliance Progress */}
          <div className={`${CARD} p-6`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Compliance Breakdown
                </p>
                <p className="text-xs text-gray-500">{activeFilterLabel} shown in gap analysis.</p>
              </div>
              <button
                onClick={() => handleFilterChange("all")}
                className={`shrink-0 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-[7px] transition-colors ${
                  filter === "all" ? "bg-[#323030] text-white" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </button>
            </div>
            <div className="space-y-2">
              {(["critical", "moderate", "low"] as const).map((sev) => {
                const total = gaps.filter((g) => g.severity === sev).length;
                const done = gaps.filter((g) => g.severity === sev && g.status === "resolved").length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <button
                    key={sev}
                    onClick={() => handleFilterChange(sev)}
                    className={`w-full rounded-[7px] px-3 py-2 text-left transition-colors ${
                      filter === sev ? "bg-gray-50 ring-1 ring-gray-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-700 font-medium capitalize">{sev}</span>
                      <span className="text-gray-400">{done}/{total} resolved</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-[7px] h-1.5">
                      <div className={`h-1.5 rounded-[7px] ${severityConfig[sev].bar}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-400">{pct}% compliant</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resource Readiness */}
          <div className={`${CARD} p-6`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Resource Inventory</p>
            <div className="space-y-3">
              {resources.map((r) => {
                const pct = Math.round((r.available / r.total) * 100);
                const low = pct < 50;
                return (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-medium ${low ? "text-red-500" : "text-gray-700"}`}>{r.name}</span>
                      <span className="text-gray-400">{r.available}/{r.total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-[7px] h-1.5">
                      <div
                        className={`h-1.5 rounded-[7px] ${low ? "bg-red-400" : "bg-[#323030]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
