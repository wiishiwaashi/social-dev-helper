"use client";

import { lgu, agencyRequests, actionItems } from "@/lib/data";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Send,
  Bot,
  FileDown,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CARD = "bg-white rounded-[7px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

const incidentSummary = {
  name: "Typhoon Carina",
  date: "July 24, 2024",
  duration: "14 hours",
  peakLevel: "18.1m (Danger Level)",
  totalEvacuees: 1240,
  affectedBarangays: 5,
  responseTime: "42 minutes",
};

const whatWorked = [
  "Preemptive evacuation of Tumana and Calumpang barangays before peak flood level.",
  "DOH-NCR medical team deployed within 1 hour of request.",
  "OCD-NCR rescue boat request (REQ001) approved and delivered same day.",
  "EOC remained operational throughout the 14-hour event.",
];

const whatFailed = [
  "No nighttime evacuation protocol in place — buddy system had to be improvised.",
  "Life jacket shortage (only 12 of 30 required) created risk during water rescue.",
  "Food pack stock ran low after 8 hours; DSWD-NCR delivery arrived 4 hours late.",
  "No backup communication channel when primary radio system experienced interference.",
];

const lessonsLearned = [
  {
    finding: "Nighttime evacuation gap (G001) directly impacted response quality.",
    recommendation: "Establish and drill a formal nighttime evacuation protocol before next typhoon season.",
    linkedGap: "G001",
  },
  {
    finding: "Life jacket shortage created avoidable risk during water rescue operations.",
    recommendation: "Procure 18 additional life jackets and set automatic reorder triggers in inventory.",
    linkedGap: "G002",
  },
  {
    finding: "Single communication channel is a critical point of failure.",
    recommendation: "Set up an SMS-based backup communication tree with all barangay captains.",
    linkedGap: "G003",
  },
  {
    finding: "Food pack supply chain has a 4-hour minimum lag from DSWD-NCR.",
    recommendation: "Maintain minimum 5-day emergency food stock to account for supply delays.",
    linkedGap: null,
  },
];

const aiDebriefMessages = [
  {
    role: "assistant",
    text: "Typhoon Carina debrief complete. I've analyzed your action log, resource consumption, and agency requests against NDRRMC benchmarks.\n\nOverall response rating: Satisfactory (3 of 4 critical actions completed on time). Key area for improvement: supply chain preparedness.",
  },
  {
    role: "user",
    text: "What should we prioritize before the next typhoon season?",
  },
  {
    role: "assistant",
    text: "Top 3 priorities based on this incident:\n1. Resolve Gap G001 — nighttime evacuation protocol (highest operational impact)\n2. Resolve Gap G002 — life jacket procurement (direct safety risk)\n3. Pre-position food packs for 5 days rather than 3\n\nThese lessons have been flagged in your Pre-Disaster gap analysis dashboard.",
  },
];

export default function PostDisasterPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(aiDebriefMessages);
  const [pdfReady, setPdfReady] = useState(false);

  const doneActions = actionItems.filter((a) => a.status === "done").length;
  const deliveredRequests = agencyRequests.filter((r) => r.status === "delivered").length;

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Analyzing incident data and NDRRMC historical benchmarks... Based on Typhoon Carina's impact profile and your LGU's response, I recommend updating your DRRM plan's Section 4 (Resource Management) to reflect the supply chain delays observed during this event.",
        },
      ]);
    }, 800);
  };

  return (
    <main className="p-6 space-y-5 min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          <span>Overview</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">Post-Disaster</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {lgu.name} · NCR · City DRRM Office
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Post-Disaster Debrief</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPdfReady(true)}
              className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 bg-white text-gray-700 px-3 py-1.5 rounded-[7px] hover:bg-gray-50 transition-colors"
            >
              {pdfReady ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <FileDown className="w-3.5 h-3.5" />}
              {pdfReady ? "PDF Ready" : "Export PDF"}
            </button>
            <Link
              href="/pre-disaster"
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#323030] text-white px-3 py-1.5 rounded-[7px] hover:bg-[#1a1818] transition-colors"
            >
              View Updated Gap Analysis <TrendingUp className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        {pdfReady && (
          <div className="mt-3 ml-auto w-fit rounded-[7px] border border-green-100 bg-green-50 px-4 py-2 text-xs text-green-700">
            Post-disaster report queued: AGUHON-CARINA-DEBRIEF.pdf
          </div>
        )}
      </div>

      {/* Incident Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Incident", value: incidentSummary.name, sub: incidentSummary.date },
          { label: "Total Evacuees", value: incidentSummary.totalEvacuees.toLocaleString(), sub: `${incidentSummary.affectedBarangays} barangays affected` },
          { label: "Actions Completed", value: `${doneActions}/${actionItems.length}`, sub: "From action board" },
          { label: "Agency Requests Fulfilled", value: `${deliveredRequests}/${agencyRequests.length}`, sub: "Delivered on time" },
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
        {/* Left + Center: What Worked / What Failed / Lessons */}
        <div className="col-span-2 space-y-4">
          {/* What Worked / What Failed */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${CARD} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h2 className="text-sm font-bold text-gray-900">What Worked</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {whatWorked.map((item, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${CARD} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-bold text-gray-900">What Failed</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {whatFailed.map((item, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-start gap-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lessons Learned */}
          <div className={`${CARD} overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">Lessons Learned</h2>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Feeds into Pre-Disaster Dashboard
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {lessonsLearned.map((l, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 mb-1">{l.finding}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">↳ {l.recommendation}</p>
                    </div>
                    {l.linkedGap && (
                      <Link
                        href="/pre-disaster"
                        className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-[7px] bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                      >
                        {l.linkedGap}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Debrief Assistant */}
        <div className={`${CARD} flex flex-col overflow-hidden`}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">AguhonAI Debrief</h2>
            <span className="ml-auto text-[10px] font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-[7px]">
              Post-Incident
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-[7px] px-3 py-2.5 text-xs leading-relaxed ${
                    m.role === "user" ? "bg-[#323030] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {m.role === "assistant" && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">AguhonAI Debrief</p>
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
                placeholder="Ask about this incident..."
                className="flex-1 text-xs bg-transparent outline-none placeholder:text-gray-400"
              />
              <button onClick={handleSend} className="text-gray-500 hover:text-gray-900 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 mt-2 text-center uppercase tracking-widest">
              NDRRMC guidelines & incident data
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
