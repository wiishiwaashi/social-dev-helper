import { lgu, stats, activities, gaps, resources } from "@/lib/data";
import {
  AlertTriangle,
  ShieldAlert,
  Package,
  CheckSquare,
  Users,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const activityTypeStyles: Record<string, string> = {
  alert: "bg-red-100 text-red-600",
  update: "bg-blue-100 text-blue-600",
  request: "bg-amber-100 text-amber-600",
  response: "bg-green-100 text-green-600",
};

const CARD = "bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6";

export default function OverviewPage() {
  const criticalGaps = gaps.filter((g) => g.severity === "critical" && g.status !== "resolved").length;

  return (
    <main className="p-6 space-y-5 min-h-screen">
      {/* Alert Banner */}
      <div className="bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-6 py-4 flex items-center gap-3 border-l-4 border-red-500">
        <div className="w-2 h-2 rounded-[7px] bg-red-500 animate-pulse shrink-0" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500 mb-0.5">Active Disaster</p>
          <p className="text-sm font-medium text-gray-800">
            {lgu.activeDisaster} — {lgu.alertLabel} declared for {lgu.name}
          </p>
        </div>
        <Link
          href="/during-disaster"
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-[#323030] text-white px-3 py-1.5 rounded-[7px] hover:bg-[#1a1818] transition-colors"
        >
          Response Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {lgu.name} · NCR · City DRRM Office
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          icon={<AlertTriangle className="w-4 h-4 text-[#323030]" />}
          label="Active Alerts"
          value={String(stats.activeAlerts)}
          sub="Signal No. 2"
        />
        <StatCard
          icon={<ShieldAlert className="w-4 h-4 text-[#323030]" />}
          label="DRRM Gaps"
          value={`${criticalGaps} critical`}
          sub={`${gaps.length} total`}
        />
        <StatCard
          icon={<Package className="w-4 h-4 text-[#323030]" />}
          label="Resource Readiness"
          value={`${stats.resourceReadiness}%`}
          sub="4 of 6 types stocked"
        />
        <StatCard
          icon={<CheckSquare className="w-4 h-4 text-[#323030]" />}
          label="Pending Actions"
          value={String(stats.pendingActions)}
          sub="2 high priority"
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-[#323030]" />}
          label="Evacuees"
          value={stats.evacuees.toLocaleString()}
          sub={`${stats.affectedBarangays} barangays`}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className={`col-span-2 ${CARD} p-0 overflow-hidden`}>
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Today</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activities.map((a, i) => (
              <div key={i} className="px-6 py-4 flex items-start gap-3">
                <span
                  className={`mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-[7px] shrink-0 ${
                    activityTypeStyles[a.type]
                  }`}
                >
                  {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.actor} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Compliance Score */}
          <div className={CARD}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">DRRM Compliance</p>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-end gap-1.5 mt-3 mb-3">
              <span className="text-3xl font-bold text-gray-900">62%</span>
              <span className="text-sm text-gray-400 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-[7px] h-2 mb-3">
              <div className="bg-[#323030] h-2 rounded-[7px]" style={{ width: "62%" }} />
            </div>
            <p className="text-xs text-gray-500">{criticalGaps} critical gaps need attention.</p>
            <Link
              href="/pre-disaster"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              View gap analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Resource Summary */}
          <div className={CARD}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Resource Summary</p>
              <MapPin className="w-4 h-4 text-gray-300" />
            </div>
            <div className="space-y-3">
              {resources.slice(0, 4).map((r) => {
                const pct = Math.round((r.available / r.total) * 100);
                return (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-700 font-medium">{r.name}</span>
                      <span className="text-gray-400">{r.available}/{r.total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-[7px] h-1.5">
                      <div
                        className={`h-1.5 rounded-[7px] ${
                          "bg-[#323030]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              href="/during-disaster"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              View all resources <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-5 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
