"use client";

import {
  actionItems,
  affectedBarangays,
  resources,
  agencyRequests,
  lgu,
} from "@/lib/data";
import type { ActionItem } from "@/lib/data";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Send,
  Package,
  MapPin,
  Radio,
  Bot,
} from "lucide-react";
import { useState } from "react";

const statusColors = {
  monitoring: "bg-gray-100 text-gray-600",
  evacuating: "bg-amber-100 text-amber-600",
  critical: "bg-red-100 text-red-600",
};

const waterColors = {
  normal: "text-green-600",
  elevated: "text-amber-500",
  critical: "text-red-500",
};

const requestStatusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-600" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-600" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-600" },
};

const aiMessages = [
  {
    role: "assistant",
    text: "Based on current water level data and Typhoon Carina's trajectory, I recommend initiating preemptive evacuation for Tumana and Calumpang within the next 2 hours. Historical data from Typhoon Ulysses (2020) shows these areas experience rapid water rise.",
  },
  {
    role: "user",
    text: "What resources do we need to prioritize?",
  },
  {
    role: "assistant",
    text: "Priority resources for your current situation:\n1. Rescue boats — 2 more needed for Tumana (request from OCD-NCR, REQ001 already approved)\n2. Food packs — current stock covers ~2.5 days; initiate REQ002 to DSWD-NCR immediately\n3. Medical teams — DOH-NCR teams deployed, sufficient for now\n\nYour critical gap: Tumana has no nighttime evacuation protocol (Gap G001). Coordinate with barangay captain for manual buddy system tonight.",
  },
];

const CARD = "bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

export default function DuringDisasterPage() {
  const [actions, setActions] = useState<ActionItem[]>(actionItems);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(aiMessages);

  const toggleStatus = (id: string) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next: Record<string, ActionItem["status"]> = {
          pending: "in_progress",
          in_progress: "done",
          done: "pending",
        };
        return { ...a, status: next[a.status] };
      })
    );
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Analyzing your query against NDRRMC protocols and Marikina City's DRRM plan... Based on available data, I recommend coordinating with the City Health Officer to ensure medical supply replenishment before the 6PM peak flood period.",
        },
      ]);
    }, 800);
  };

  const done = actions.filter((a) => a.status === "done").length;

  return (
    <main className="p-6 flex flex-col gap-5 min-h-screen">
      {/* Alert Banner */}
      <div className={`${CARD} px-6 py-4 flex items-center gap-3 border-l-4 border-red-500`}>
        <div className="w-2 h-2 rounded-[7px] bg-red-500 animate-pulse shrink-0" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500 mb-0.5">
            Active Disaster Response
          </p>
          <p className="text-sm font-medium text-gray-800">
            {lgu.activeDisaster} · {lgu.alertLabel}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">EOC Status</p>
            <p className="text-sm font-bold text-gray-900">Active</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Evacuees</p>
            <p className="text-sm font-bold text-gray-900">1,240</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Duration</p>
            <p className="text-sm font-bold text-gray-900">3h 42m</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        <span>Overview</span>
        <ChevronRight className="w-3 h-3" />
        <span>During Disaster</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">Response Workspace</span>
      </div>

      {/* 3-Column Layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Action Board */}
        <div className="flex flex-col gap-4 w-[320px] shrink-0">
          <div className={`${CARD} flex flex-col overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Action Board</h2>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {done}/{actions.length} done
              </span>
            </div>
            <div className="overflow-y-auto">
              {actions.map((a) => (
                <div
                  key={a.id}
                  className="px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={() => toggleStatus(a.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {a.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-[#323030]" />
                      ) : a.status === "in_progress" ? (
                        <Clock className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-relaxed ${
                          a.status === "done" ? "line-through text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {a.task}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.role}</p>
                      <p className="text-[10px] text-gray-400 italic mt-0.5">↳ {a.trigger}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-[7px] ${
                        a.priority === "high"
                          ? "bg-red-50 text-red-500"
                          : a.priority === "medium"
                          ? "bg-amber-50 text-amber-500"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {a.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Barangay Status + Resources + Requests */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Affected Barangays */}
          <div className={`${CARD} overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">Affected Barangays</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-50">
                    <th className="text-left px-5 py-3 font-semibold">Barangay</th>
                    <th className="text-left px-4 py-3 font-semibold">At Risk</th>
                    <th className="text-left px-4 py-3 font-semibold">Evacuees</th>
                    <th className="text-left px-4 py-3 font-semibold">Water Level</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {affectedBarangays.map((b) => (
                    <tr key={b.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs font-semibold text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{b.populationAtRisk.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900">{b.evacuees}</td>
                      <td className={`px-4 py-3 text-xs font-semibold capitalize ${waterColors[b.waterLevel]}`}>
                        {b.waterLevel}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-[7px] capitalize ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resources + Agency Requests */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Resources */}
            <div className={`${CARD} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Resource Tracker</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {resources.map((r) => {
                  const pct = Math.round((r.available / r.total) * 100);
                  return (
                    <div key={r.name} className="px-5 py-3.5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-semibold text-gray-800">{r.name}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{r.available}/{r.total}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-[7px] h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-[7px] ${"bg-[#323030]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">{r.location}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agency Requests */}
            <div className={`${CARD} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-900">Agency Requests</h2>
                </div>
                <button className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 border border-gray-200 px-2.5 py-1 rounded-[7px] hover:bg-gray-50 transition-colors">
                  + New
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {agencyRequests.map((r) => {
                  const s = requestStatusConfig[r.status];
                  return (
                    <div key={r.id} className="px-5 py-3.5 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{r.agency}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{r.item} · {r.quantity}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{r.requestedAt}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-[7px] shrink-0 ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div className={`w-[270px] shrink-0 ${CARD} flex flex-col overflow-hidden`}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">AI Assistant</h2>
            <span className="ml-auto text-[10px] font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded-[7px]">
              Active
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-[7px] px-3 py-2.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#323030] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {m.role === "assistant" && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Aguhon AI</p>
                  )}
                  {m.text.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-[7px] border border-gray-100 px-3 py-2.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI assistant..."
                className="flex-1 text-xs bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 mt-2 text-center uppercase tracking-widest">
              NDRRMC guidelines & DRRM plan
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
