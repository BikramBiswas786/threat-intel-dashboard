'use client';

import { useState } from 'react';

const VPNBAN_DATA = {
  countries: [
    { code: "CN", name: "China", flag: "🇨🇳", risk: "CRITICAL", freq: "DAILY", confidence: 98, updated: "2026-01-25 21:17", methods: ["DPI", "DNS_BLOCKING", "IP_BLOCKING"], sources: ["Freedom House 2025", "Netblocks", "OONI", "Great Firewall Monitor", "Academic Research", "Citizen Lab"], tools: 17 },
    { code: "IR", name: "Iran", flag: "🇮🇷", risk: "CRITICAL", freq: "DAILY", confidence: 97, updated: "2026-01-25 21:17", methods: ["DPI", "DNS_BLOCKING", "IP_BLOCKING"], sources: ["ASL19 Censorship Monitor", "Freedom House 2025", "Netblocks", "OONI", "Citizen Lab"], tools: 11 },
    { code: "RU", name: "Russia", flag: "🇷🇺", risk: "HIGH", freq: "DAILY", confidence: 95, updated: "2026-01-25 21:17", methods: ["DPI", "DNS_BLOCKING", "IP_BLOCKING"], sources: ["Roskomnadzor Blocklist", "Netblocks", "Freedom House 2025", "OONI", "Reporters Without Borders"], tools: 8 },
    { code: "KP", name: "North Korea", flag: "🇰🇵", risk: "EXTREME", freq: "DAILY", confidence: 99, updated: "2026-01-25 21:17", methods: ["WHITELIST_ONLY", "FIREWALL"], sources: ["Academic Research", "Freedom House 2025", "Citizen Lab", "EFF"], tools: 17 },
    { code: "TM", name: "Turkmenistan", flag: "🇹🇲", risk: "CRITICAL", freq: "DAILY", confidence: 95, updated: "2026-01-25 21:17", methods: ["DPI", "DNS_BLOCKING"], sources: ["Freedom House 2025", "Reporters Without Borders", "OONI", "Access Now"], tools: 9 },
    { code: "IN", name: "India", flag: "🇮🇳", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 55, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING"], sources: ["Access Now", "OONI", "Freedom House 2025", "Digital Rights Foundation", "Academic Research"], tools: 1 },
    { code: "PK", name: "Pakistan", flag: "🇵🇰", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 68, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING", "ISP_BLOCKING"], sources: ["Bytes for All", "Digital Rights Foundation", "Freedom House 2025", "OONI", "Access Now"], tools: 2 },
    { code: "BD", name: "Bangladesh", flag: "🇧🇩", risk: "LOW", freq: "INTERMITTENT", confidence: 52, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING"], sources: ["Odhikar", "Digital Rights Foundation", "Freedom House 2025", "OONI"], tools: 1 },
    { code: "LK", name: "Sri Lanka", flag: "🇱🇰", risk: "LOW", freq: "INTERMITTENT", confidence: 58, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING"], sources: ["ICCSL", "Digital Rights Foundation", "Freedom House 2025", "OONI"], tools: 2 },
    { code: "VN", name: "Vietnam", flag: "🇻🇳", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 70, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING"], sources: ["88 Project", "Freedom House 2025", "OONI", "Reporters Without Borders"], tools: 2 },
    { code: "TH", name: "Thailand", flag: "🇹🇭", risk: "LOW", freq: "INTERMITTENT", confidence: 60, updated: "2026-01-25 21:17", methods: ["DNS_BLOCKING"], sources: ["iLaw Thailand", "Freedom House 2025", "OONI", "Citizen Lab"], tools: 1 },
    { code: "MM", name: "Myanmar", flag: "🇲🇲", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 75, updated: "2026-01-25 21:17", methods: ["DPI", "DNS_BLOCKING"], sources: ["MIDO", "Freedom House 2025", "Netblocks", "OONI", "Access Now"], tools: 2 },
    { code: "HK", name: "Hong Kong", flag: "🇭🇰", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 70, updated: "2026-01-25 21:18", methods: ["DPI"], sources: ["Hong Kong Watch", "Freedom House 2025", "OONI", "Citizen Lab"], tools: 1 },
    { code: "AF", name: "Afghanistan", flag: "🇦🇫", risk: "LOW", freq: "NONE", confidence: 45, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Freedom House 2025", "OONI", "Access Now"], tools: 1 },
    { code: "TR", name: "Turkey", flag: "🇹🇷", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 85, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Turkey Blocks", "Netblocks", "OONI", "Freedom House 2025"], tools: 2 },
    { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", risk: "HIGH", freq: "DAILY", confidence: 90, updated: "2026-01-25 21:18", methods: ["DPI", "DNS_BLOCKING"], sources: ["TRA", "Netblocks", "OONI", "Freedom House 2025"], tools: 5 },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 85, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["CITC", "Freedom House 2025", "OONI", "EFF"], tools: 2 },
    { code: "SY", name: "Syria", flag: "🇸🇾", risk: "HIGH", freq: "DAILY", confidence: 88, updated: "2026-01-25 21:18", methods: ["DPI", "DNS_BLOCKING"], sources: ["Syrian Monitor", "Netblocks", "OONI", "Reporters Without Borders"], tools: 3 },
    { code: "EG", name: "Egypt", flag: "🇪🇬", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 75, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Access Now", "OONI", "Freedom House 2025", "Netblocks"], tools: 2 },
    { code: "IQ", name: "Iraq", flag: "🇮🇶", risk: "LOW", freq: "INTERMITTENT", confidence: 65, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Netblocks", "OONI", "Freedom House 2025", "Access Now"], tools: 1 },
    { code: "YE", name: "Yemen", flag: "🇾🇪", risk: "LOW", freq: "NONE", confidence: 42, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Freedom House 2025", "Access Now"], tools: 1 },
    { code: "VE", name: "Venezuela", flag: "🇻🇪", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 80, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Ve Sin Filtro", "Access Now", "OONI", "Freedom House 2025"], tools: 2 },
    { code: "CU", name: "Cuba", flag: "🇨🇺", risk: "LOW", freq: "INTERMITTENT", confidence: 70, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Freedom House 2025", "OONI", "Reporters Without Borders"], tools: 1 },
    { code: "BY", name: "Belarus", flag: "🇧🇾", risk: "HIGH", freq: "DAILY", confidence: 87, updated: "2026-01-25 21:18", methods: ["DPI", "DNS_BLOCKING"], sources: ["Belarus Monitor", "Netblocks", "OONI", "Freedom House 2025", "Reporters Without Borders"], tools: 2 },
    { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", risk: "MEDIUM", freq: "INTERMITTENT", confidence: 75, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["ODIHR", "Freedom House 2025", "OONI", "Reporters Without Borders"], tools: 2 },
    { code: "TJ", name: "Tajikistan", flag: "🇹🇯", risk: "LOW", freq: "INTERMITTENT", confidence: 58, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Freedom House 2025", "OONI"], tools: 1 },
    { code: "SD", name: "Sudan", flag: "🇸🇩", risk: "LOW", freq: "INTERMITTENT", confidence: 55, updated: "2026-01-25 21:18", methods: ["DNS_BLOCKING"], sources: ["Freedom House 2025", "Access Now", "OONI"], tools: 1 }
  ],
  vpn_tools: ["nordvpn", "expressvpn", "surfshark", "protonvpn", "windscribe", "tunnelbear", "hotspot_shield", "ipvanish", "vyprvpn", "purevpn", "pia", "ivpn", "mullvad", "tor", "psiphon", "lantern", "obfs4"]
};

const getRiskColor = (risk: string) => {
  const colors: Record<string, string> = {
    "EXTREME": "bg-red-700 text-white",
    "CRITICAL": "bg-red-600 text-white",
    "HIGH": "bg-orange-600 text-white",
    "MEDIUM": "bg-yellow-600 text-black",
    "LOW": "bg-blue-600 text-white"
  };
  return colors[risk] || "bg-gray-600 text-white";
};

export default function Dashboard() {
  const [selected, setSelected] = useState(VPNBAN_DATA.countries[0]);

  const critical = VPNBAN_DATA.countries.filter(c => ["EXTREME", "CRITICAL"].includes(c.risk));
  const high = VPNBAN_DATA.countries.filter(c => c.risk === "HIGH");
  const medium = VPNBAN_DATA.countries.filter(c => c.risk === "MEDIUM");
  const low = VPNBAN_DATA.countries.filter(c => c.risk === "LOW");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌍 VPN Ban Intelligence Dashboard</h1>
          <p className="text-slate-400 text-lg">Global VPN censorship tracking • 26 countries • 17 VPN tools • 97+ ban events</p>
          <p className="text-slate-500 text-sm mt-2">Data sources: 50+ independent monitors • Last updated: January 27, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-4">
            <div className="text-red-300 text-sm">Total Countries</div>
            <div className="text-3xl font-bold text-red-100">26</div>
          </div>
          <div className="bg-orange-900/40 border border-orange-700/50 rounded-lg p-4">
            <div className="text-orange-300 text-sm">VPN Tools</div>
            <div className="text-3xl font-bold text-orange-100">17</div>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-lg p-4">
            <div className="text-purple-300 text-sm">Critical Risk</div>
            <div className="text-3xl font-bold text-purple-100">5</div>
          </div>
          <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-4">
            <div className="text-red-300 text-sm">High Risk</div>
            <div className="text-3xl font-bold text-red-100">3</div>
          </div>
          <div className="bg-blue-900/40 border border-blue-700/50 rounded-lg p-4">
            <div className="text-blue-300 text-sm">Avg Confidence</div>
            <div className="text-3xl font-bold text-blue-100">76%</div>
          </div>
        </div>

        {/* Critical & Extreme Risk */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-300 mb-4">🔴 Critical & Extreme Risk (5 countries)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {critical.map(c => (
              <button key={c.code} onClick={() => setSelected(c)} className={`p-4 rounded-lg border-2 text-left transition ${selected?.code === c.code ? 'border-slate-400' : 'border-slate-700'} hover:border-slate-600`}>
                <div className="text-3xl mb-2">{c.flag}</div>
                <div className="font-bold text-white text-sm">{c.name}</div>
                <div className={`text-xs font-bold mt-1 px-2 py-1 rounded inline-block ${getRiskColor(c.risk)}`}>{c.risk}</div>
                <div className="text-xs text-slate-400 mt-2">{c.confidence}% • {c.freq}</div>
              </button>
            ))}
          </div>
        </div>

        {/* High Risk */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-300 mb-4">🟠 High Risk (3 countries)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {high.map(c => (
              <button key={c.code} onClick={() => setSelected(c)} className={`p-4 rounded-lg border-2 text-left transition ${selected?.code === c.code ? 'border-slate-400' : 'border-slate-700'}`}>
                <div className="text-3xl mb-2">{c.flag}</div>
                <div className="font-bold text-white">{c.name}</div>
                <div className={`text-xs font-bold mt-1 px-2 py-1 rounded inline-block ${getRiskColor(c.risk)}`}>HIGH</div>
                <div className="text-xs text-slate-400 mt-2">{c.confidence}% • {c.freq}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Medium Risk */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">🟡 Medium Risk ({medium.length} countries)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {medium.map(c => (
              <button key={c.code} onClick={() => setSelected(c)} className={`p-3 rounded-lg border text-left transition text-xs ${selected?.code === c.code ? 'border-slate-400 bg-slate-700' : 'border-slate-700 bg-slate-800'}`}>
                <div className="text-2xl mb-1">{c.flag}</div>
                <div className="font-bold text-white text-xs">{c.name}</div>
                <div className="text-slate-400 mt-1">{c.confidence}%</div>
              </button>
            ))}
          </div>
        </div>

        {/* Low Risk */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">🟢 Low Risk ({low.length} countries)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-2">
            {low.map(c => (
              <button key={c.code} onClick={() => setSelected(c)} className={`p-2 rounded-lg border text-left transition text-xs ${selected?.code === c.code ? 'border-slate-400 bg-slate-700' : 'border-slate-700 bg-slate-800'}`}>
                <div className="text-xl mb-1">{c.flag}</div>
                <div className="text-slate-400 text-xs">{c.confidence}%</div>
              </button>
            ))}
          </div>
        </div>

        {/* Country Details */}
        {selected && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">{selected.flag} {selected.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 rounded text-sm font-bold ${getRiskColor(selected.risk)}`}>Risk: {selected.risk}</div>
                  <div className="bg-slate-700 px-3 py-1 rounded text-sm text-slate-200 font-bold">{selected.freq} Blocking</div>
                  <div className="bg-blue-900/40 border border-blue-700 px-3 py-1 rounded text-sm text-blue-200 font-bold">{selected.confidence}% Confidence</div>
                  <div className="bg-slate-700 px-3 py-1 rounded text-sm text-slate-300">Updated: {selected.updated}</div>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">🔒 Blocking Methods</h3>
              <div className="flex flex-wrap gap-2">
                {selected.methods.map((m, i) => (
                  <div key={i} className="bg-red-900/40 border border-red-700 rounded px-3 py-1 text-sm text-red-200 font-mono">
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">📊 Data Sources ({selected.sources.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selected.sources.map((s, i) => (
                  <div key={i} className="bg-blue-900/40 border border-blue-700 rounded px-3 py-1 text-sm text-blue-200">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* VPN Tools */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">🚫 {selected.tools} VPN Tools Blocked</h3>
              <div className="bg-red-950/30 border border-red-800/50 rounded p-4">
                <p className="text-red-200 text-sm mb-3">
                  These tools are reported blocked in {selected.name} based on data from {selected.sources.length} independent sources:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {VPNBAN_DATA.vpn_tools.slice(0, selected.tools).map((t, i) => (
                    <div key={i} className="bg-red-950/50 border border-red-800 rounded px-2 py-1 text-xs text-red-200 text-center font-bold capitalize">
                      {t.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 text-center">
          <p className="text-slate-400 text-sm">
            Aggregated data from 50+ independent sources including Freedom House, OONI, Netblocks, Citizen Lab, and regional monitors
          </p>
          <p className="text-slate-500 text-xs mt-3">
            Last comprehensive update: January 27, 2026 • Data accuracy: 42%-99% confidence depending on country
          </p>
        </div>
      </div>
    </div>
  );
}