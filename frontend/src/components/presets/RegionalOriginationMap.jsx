import React, { useState } from "react";
import { Building2, ShieldCheck, MapPin, ChevronRight, Activity } from "lucide-react";

/**
 * RegionalOriginationMap Component
 * Preset source: mapcn.dev / 21st.dev
 * Adapted to CreditSea: Minimalist vector nodal map of regional lending hubs & escrow liquidity
 */
export default function RegionalOriginationMap({ className = "" }) {
  const hubs = [
    { id: "MUM", name: "Mumbai Financial Hub", x: 26, y: 55, volume: "₹18.4 Cr", activeLoans: 940, npa: "0.3%", status: "Prime Escrow" },
    { id: "DEL", name: "Delhi-NCR Commercial Corridor", x: 38, y: 28, volume: "₹12.6 Cr", activeLoans: 680, npa: "0.5%", status: "Direct Rail" },
    { id: "BLR", name: "Bengaluru Tech Origination Hub", x: 34, y: 76, volume: "₹15.2 Cr", activeLoans: 820, npa: "0.2%", status: "Corporate Payroll" },
    { id: "HYD", name: "Hyderabad Corporate Hub", x: 42, y: 64, volume: "₹9.8 Cr", activeLoans: 510, npa: "0.4%", status: "Partner API" },
    { id: "PUN", name: "Pune Manufacturing Corridor", x: 29, y: 60, volume: "₹6.4 Cr", activeLoans: 340, npa: "0.6%", status: "Direct Portal" },
    { id: "CHN", name: "Chennai Industrial Corridor", x: 46, y: 80, volume: "₹7.1 Cr", activeLoans: 390, npa: "0.4%", status: "Partner API" },
  ];

  const [activeHub, setActiveHub] = useState(hubs[0]);

  return (
    <div className={`bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#DDD9D0] gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#B49A68]">
            <MapPin className="w-3.5 h-3.5" />
            <span>mapcn.dev Telemetry Integration</span>
          </div>
          <h2 className="text-base font-serif font-medium text-[#171717] mt-1">
            Regional Sourcing Hubs & Escrow Settlement Nodes
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#476353] bg-[#EFEFE9] px-2.5 py-1 rounded border border-[#CCD8D0]">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>6 Active Nodes Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Vector SVG Map (7 cols) */}
        <div className="lg:col-span-7 relative bg-[#F6F4EF] border border-[#DDD9D0] rounded p-6 h-80 flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#DDD9D0_1px,transparent_1px),linear-gradient(to_bottom,#DDD9D0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

          {/* India Regional Map Schematic Path */}
          <svg viewBox="0 0 100 100" className="w-full h-full max-h-72 stroke-[#B8B2A8] fill-none relative z-10">
            {/* Inter-hub Settlement Transmission Rails */}
            <path
              d="M 38 28 L 26 55 L 29 60 L 34 76 L 46 80 L 42 64 Z"
              stroke="#B49A68"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              className="opacity-70"
            />
            {/* Direct Central Routing Lines */}
            <line x1="26" y1="55" x2="42" y2="64" stroke="#DDD9D0" strokeWidth="0.6" />
            <line x1="38" y1="28" x2="42" y2="64" stroke="#DDD9D0" strokeWidth="0.6" />

            {/* City Hub Markers (mapcn.dev pattern) */}
            {hubs.map((hub) => {
              const isSelected = activeHub.id === hub.id;
              return (
                <g
                  key={hub.id}
                  className="cursor-pointer group"
                  onClick={() => setActiveHub(hub)}
                >
                  {/* Ping wave */}
                  {isSelected && (
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="4"
                      className="fill-[#B49A68]/20 animate-ping"
                    />
                  )}
                  {/* Marker Outer Ring */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? "3" : "2"}
                    className={`${isSelected ? "fill-[#111111] stroke-[#B49A68] stroke-1" : "fill-[#FFFFFF] stroke-[#111111] stroke-1"} transition-all`}
                  />
                  {/* Hub Label */}
                  <text
                    x={hub.x + 3.5}
                    y={hub.y + 1}
                    className="font-mono text-[3.8px] fill-[#171717] font-medium tracking-wider select-none"
                  >
                    {hub.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Status Bar */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] font-mono text-[#6F6B63] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded border border-[#DDD9D0] z-20">
            <span>Escrow Primary: Meghdoot HDFC Rail</span>
            <span>Latency: 14ms (Direct)</span>
          </div>
        </div>

        {/* Selected Hub Telemetry Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-[#F6F4EF] border border-[#DDD9D0] rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDD9D0] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#B49A68] font-semibold">Node Code: {activeHub.id}</span>
              <h3 className="font-serif font-medium text-sm text-[#171717] mt-0.5">{activeHub.name}</h3>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0]">
              {activeHub.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded border border-[#DDD9D0]">
              <span className="text-[10px] font-mono uppercase text-[#969188]">Disbursed Capital</span>
              <div className="font-serif text-base font-medium text-[#171717] mt-0.5 tabular-nums">
                {activeHub.volume}
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-[#DDD9D0]">
              <span className="text-[10px] font-mono uppercase text-[#969188]">Active Borrowers</span>
              <div className="font-serif text-base font-medium text-[#171717] mt-0.5 tabular-nums">
                {activeHub.activeLoans}
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-[#DDD9D0]">
              <span className="text-[10px] font-mono uppercase text-[#969188]">Regional NPA Rate</span>
              <div className="font-serif text-base font-medium text-[#476353] mt-0.5 tabular-nums">
                {activeHub.npa}
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-[#DDD9D0]">
              <span className="text-[10px] font-mono uppercase text-[#969188]">Settlement Status</span>
              <div className="font-mono text-xs font-semibold text-[#171717] mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#476353]" /> Audited
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#6F6B63] font-light leading-relaxed">
            Directly interconnected via RBI RTGS banking pipelines. Real-time disbursement latency under 120 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
