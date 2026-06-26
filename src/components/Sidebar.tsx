"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Siren,
  ClipboardList,
} from "lucide-react";
import { mockUser } from "@/lib/data";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Pre-Disaster", href: "/pre-disaster", icon: ShieldCheck },
  { label: "During Disaster", href: "/during-disaster", icon: Siren },
  { label: "Post-Disaster", href: "/post-disaster", icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 bg-[#1e1e1e] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <p className="text-white font-bold text-base tracking-tight">Aguhon</p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mt-0.5">
          Disaster Intelligence
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-[7px] bg-white/10 text-white flex items-center justify-center text-xs font-bold">
            {mockUser.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{mockUser.name}</p>
            <p className="text-[10px] text-white/35 truncate">{mockUser.role}</p>
          </div>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Marikina City DRRM
        </p>
      </div>
    </aside>
  );
}
