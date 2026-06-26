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
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export default function PreDisasterPage() {
  const [selected, setSelected] = useState<Gap | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "moderate" | "low">("all");
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "ready">("idle");

  const criticalCount = gaps.filter((g) => g.severity === "critical" && g.status !== "resolved").length;
  const resolvedCount = gaps.filter((g) => g.status === "resolved").length;
  const openCount = gaps.filter((g) => g.status === "open").length;
  const complianceScore = Math.round((resolvedCount / gaps.length) * 100);

  const filtered = filter === "all" ? gaps : gaps.filter((g) => g.severity === filter);

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
          <button
            onClick={() => setExportState("ready")}
            className="flex items-center gap-2 text-xs font-semibold bg-[#323030] text-white px-4 py-2 rounded-[7px] hover:bg-[#1a1818] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            {exportState === "ready" ? <CheckCircle className="w-3.5 h-3.5" /> : <FileDown className="w-3.5 h-3.5" />}
            {exportState === "ready" ? "Report Ready" : "Export Compliance Report"}
          </button>
        </div>
        {exportState === "ready" && (
          <div className="mt-3 ml-auto w-fit rounded-[7px] border border-green-100 bg-green-50 px-4 py-2 text-xs text-green-700">
            PDF compliance report queued: DRRM-COMPLIANCE-MARIKINA-2026.pdf
          </div>
        )}
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

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Gap List */}
        <div className={`col-span-2 ${CARD} overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">DRRM Gap Analysis</h2>
            </div>
            <div className="flex items-center gap-1">
              {(["all", "critical", "moderate", "low"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
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
                  onClick={() => setSelected(selected?.id === g.id ? null : g)}
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${stat.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-gray-900">{g.description}</p>
                      </div>
                      <p className="text-[10px] text-gray-400">{g.category} · {g.id}</p>
                      {selected?.id === g.id && (
                        <div className="mt-3 bg-gray-50 rounded-[7px] px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Recommended Action</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{g.recommendedAction}</p>
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Compliance Breakdown</p>
            <div className="space-y-3">
              {(["critical", "moderate", "low"] as const).map((sev) => {
                const total = gaps.filter((g) => g.severity === sev).length;
                const done = gaps.filter((g) => g.severity === sev && g.status === "resolved").length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <div key={sev}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-700 font-medium capitalize">{sev}</span>
                      <span className="text-gray-400">{done}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-[7px] h-1.5">
                      <div className={`h-1.5 rounded-[7px] ${severityConfig[sev].bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resource Readiness */}
          <div className={`${CARD} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Resource Inventory</p>
              <button
                onClick={() => setShowResourceForm(true)}
                className="w-7 h-7 flex items-center justify-center rounded-[7px] bg-[#323030] text-white hover:bg-[#1a1818] transition-colors"
                aria-label="Add resource"
                title="Add resource"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
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
      {showResourceForm && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
          <div className={`${CARD} w-full max-w-sm p-5`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Mock Resource Entry</p>
                <h3 className="text-base font-bold text-gray-900">Add inventory item</h3>
              </div>
              <button
                onClick={() => setShowResourceForm(false)}
                className="w-7 h-7 flex items-center justify-center rounded-[7px] text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input className="w-full rounded-[7px] border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" defaultValue="Generator Sets" />
              <div className="grid grid-cols-2 gap-2">
                <input className="rounded-[7px] border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" defaultValue="3 available" />
                <input className="rounded-[7px] border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" defaultValue="5 required" />
              </div>
              <input className="w-full rounded-[7px] border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" defaultValue="City Hall Warehouse" />
            </div>
            <button
              onClick={() => setShowResourceForm(false)}
              className="mt-4 w-full rounded-[7px] bg-[#323030] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a1818] transition-colors"
            >
              Save Mock Resource
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
