'use client';

import { useState, useMemo } from 'react';

const VPN_BAN_DATA = {
  total_bans: 97,
  vpn_tools: [
    { id: 1, name: "ExpressVPN", category: "Commercial", price: "$8.32/month", blocked_in: ["CN", "IR", "KP"], working_in: ["US", "UK", "DE"], slow_in: ["RU", "TR"], confidence: 0.98, days_until_block: 45 },
    { id: 2, name: "NordVPN", category: "Commercial", price: "$3.99/month", blocked_in: ["CN", "IR", "RU"], working_in: ["US", "UK"], slow_in: ["TR", "VN"], confidence: 0.95, days_until_block: 62 },
    { id: 3, name: "Surfshark", category: "Commercial", price: "$2.49/month", blocked_in: ["CN", "IR"], working_in: ["US", "UK"], slow_in: ["RU", "TR"], confidence: 0.93, days_until_block: 78 },
    { id: 4, name: "ProtonVPN", category: "Commercial", price: "$4.99/month", blocked_in: ["CN", "IR", "RU"], working_in: ["US", "UK"], slow_in: ["TR"], confidence: 0.96, days_until_block: 71 },
    { id: 5, name: "Mullvad", category: "Open Source", price: "Free", blocked_in: ["CN", "RU"], working_in: ["US", "UK"], slow_in: ["TR"], confidence: 0.94, days_until_block: 88 },
    { id: 6, name: "Lantern", category: "Circumvention", price: "Free", blocked_in: ["CN", "IR", "RU", "KP"], working_in: ["US", "UK"], slow_in: [], confidence: 0.91, days_until_block: 38 },
    { id: 7, name: "Psiphon", category: "Circumvention", price: "Free", blocked_in: ["CN", "IR", "RU"], working_in: ["US", "UK"], slow_in: [], confidence: 0.92, days_until_block: 52 },
    { id: 8, name: "Tor Browser", category: "Circumvention", price: "Free", blocked_in: ["CN", "RU", "IR"], working_in: ["US", "UK"], slow_in: ["TR"], confidence: 0.94, days_until_block: 42 },
    { id: 9, name: "Shadowsocks", category: "Circumvention", price: "Free", blocked_in: ["CN", "IR"], working_in: ["US", "UK"], slow_in: ["RU"], confidence: 0.87, days_until_block: 79 },
    { id: 10, name: "Outline VPN", category: "Circumvention", price: "Free", blocked_in: ["CN", "IR"], working_in: ["US", "UK"], slow_in: ["RU"], confidence: 0.72, days_until_block: 127 },
    { id: 11, name: "CyberGhost", category: "Commercial", price: "$2.25/month", blocked_in: ["CN", "KP"], working_in: ["US", "UK"], slow_in: ["RU", "TR"], confidence: 0.91, days_until_block: 85 },
    { id: 12, name: "TunnelBear", category: "Commercial", price: "$10/month", blocked_in: ["CN", "KP"], working_in: ["US", "UK"], slow_in: ["RU"], confidence: 0.95, days_until_block: 24 },
    { id: 13, name: "Windscribe", category: "Freemium", price: "Free+", blocked_in: ["CN", "IR"], working_in: ["US", "UK"], slow_in: ["RU", "TR"], confidence: 0.90, days_until_block: 92 },
    { id: 14, name: "Hotspot Shield", category: "Commercial", price: "$2.99/month", blocked_in: ["CN", "RU"], working_in: ["US", "UK"], slow_in: ["TR", "IR"], confidence: 0.89, days_until_block: 95 },
    { id: 15, name: "IPVanish", category: "Commercial", price: "$3.25/month", blocked_in: ["CN"], working_in: ["US", "UK"], slow_in: ["RU", "TR"], confidence: 0.86, days_until_block: 101 }
  ],
  countries: [
    { code: "CN", name: "China", flag: "🇨🇳", risk: "CRITICAL", blocked: 15, slow: 5, working: 5 },
    { code: "IR", name: "Iran", flag: "🇮🇷", risk: "CRITICAL", blocked: 9, slow: 3, working: 3 },
    { code: "RU", name: "Russia", flag: "🇷🇺", risk: "HIGH", blocked: 4, slow: 5, working: 6 },
    { code: "KP", name: "North Korea", flag: "🇰🇵", risk: "EXTREME", blocked: 4, slow: 0, working: 0 },
    { code: "TR", name: "Turkey", flag: "🇹🇷", risk: "MEDIUM", blocked: 0, slow: 5, working: 10 }
  ]
};

export default function Dashboard() {
  const [selected, setSelected] = useState(VPN_BAN_DATA.countries[0]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const tools = useMemo(() => {
    if (!selected) return [];
    return VPN_BAN_DATA.vpn_tools.map(t => {
      const blocked = t.blocked_in.includes(selected.code);
      const slow = t.slow_in.includes(selected.code);
      const working = t.working_in.includes(selected.code);
      return { ...t, status: blocked ? 'BLOCKED' : slow ? 'SLOW' : working ? 'WORKING' : 'UNKNOWN', blocked, slow, working };
    }).sort((a, b) => {
      const order = { BLOCKED: 0, SLOW: 1, WORKING: 2 };
      return (order[a.status as keyof typeof order] || 3) - (order[b.status as keyof typeof order] || 3);
    });
  }, [selected]);

  const blocked = tools.filter(t => t.blocked);
  const slow = tools.filter(t => t.slow);
  const working = tools.filter(t => t.working);

  const toggleExpand = (id: number) => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">🌍 VPN Ban Intelligence Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring • 97 ban events • 5 countries • 15 VPN tools</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-4">
            <div className="text-red-300 text-sm">Total VPN Tools</div>
            <div className="text-3xl font-bold text-red-100">15</div>
          </div>
          <div className="bg-orange-900/40 border border-orange-700/50 rounded-lg p-4">
            <div className="text-orange-300 text-sm">Ban Events</div>
            <div className="text-3xl font-bold text-orange-100">97</div>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-lg p-4">
            <div className="text-purple-300 text-sm">Risk Countries</div>
            <div className="text-3xl font-bold text-purple-100">5</div>
          </div>
          <div className="bg-blue-900/40 border border-blue-700/50 rounded-lg p-4">
            <div className="text-blue-300 text-sm">Avg Confidence</div>
            <div className="text-3xl font-bold text-blue-100">92%</div>
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-3">📍 Select Country</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {VPN_BAN_DATA.countries.map(c => (
              <button 
                key={c.code} 
                onClick={() => setSelected(c)} 
                className={`p-3 rounded-lg border-2 text-left transition ${
                  selected?.code === c.code 
                    ? 'bg-red-900 border-red-600' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-1">{c.flag}</div>
                    <div className={`font-bold text-sm ${selected?.code === c.code ? 'text-red-100' : 'text-white'}`}>
                      {c.name}
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                    c.risk === 'EXTREME' ? 'bg-red-600' : 
                    c.risk === 'CRITICAL' ? 'bg-red-700' : 
                    'bg-orange-700'
                  } text-white`}>
                    {c.risk}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country Details */}
        {selected && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{selected.flag} {selected.name} - VPN Ban Report</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-4">
                  <div className="text-red-300 text-sm mb-1">🔴 Blocked Tools</div>
                  <div className="text-3xl font-bold text-red-100">{blocked.length}</div>
                  <div className="text-xs text-red-400 mt-1">Total blocked</div>
                </div>
                <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-lg p-4">
                  <div className="text-yellow-300 text-sm mb-1">🟠 Slow Tools</div>
                  <div className="text-3xl font-bold text-yellow-100">{slow.length}</div>
                  <div className="text-xs text-yellow-400 mt-1">Throttled</div>
                </div>
                <div className="bg-green-900/40 border border-green-700/50 rounded-lg p-4">
                  <div className="text-green-300 text-sm mb-1">🟢 Working Tools</div>
                  <div className="text-3xl font-bold text-green-100">{working.length}</div>
                  <div className="text-xs text-green-400 mt-1">Safe to use</div>
                </div>
              </div>
            </div>

            {/* Blocked Tools */}
            {blocked.length > 0 && (
              <div className="bg-slate-800/50 border border-red-700/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-200 mb-4">🔴 Blocked VPN Tools ({blocked.length})</h3>
                <div className="space-y-3">
                  {blocked.map(tool => (
                    <div key={tool.id} className="bg-red-950/50 border border-red-800/50 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => toggleExpand(tool.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-red-900/30 transition text-left"
                      >
                        <div className="flex-1">
                          <div className="font-bold text-red-100">{tool.name}</div>
                          <div className="text-xs text-red-400">{tool.category} • {tool.price}</div>
                        </div>
                        <div className="text-right mr-3">
                          <div className="text-xs text-red-400">⚠️ {tool.days_until_block} days</div>
                          <div className="text-xs text-red-300 font-bold">{Math.round(tool.confidence * 100)}%</div>
                        </div>
                        <div className={`transition-transform ${expanded.has(tool.id) ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </button>
                      {expanded.has(tool.id) && (
                        <div className="border-t border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                          <div className="mb-2">
                            <span className="font-bold">Blocked in:</span> {tool.blocked_in.join(', ')}
                          </div>
                          <div>
                            <span className="font-bold">Working in:</span> {tool.working_in.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slow Tools */}
            {slow.length > 0 && (
              <div className="bg-slate-800/50 border border-yellow-700/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-200 mb-4">🟠 Slow/Throttled Tools ({slow.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {slow.map(tool => (
                    <div key={tool.id} className="bg-yellow-950/50 border border-yellow-800/50 rounded-lg p-4">
                      <div className="font-bold text-yellow-100">{tool.name}</div>
                      <div className="text-xs text-yellow-400 mb-2">{tool.category}</div>
                      <div className="text-xs text-yellow-400">⏱️ {Math.round(tool.confidence * 100)}% confidence</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Working Tools */}
            {working.length > 0 && (
              <div className="bg-slate-800/50 border border-green-700/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-200 mb-4">🟢 Working Tools ({working.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {working.map(tool => (
                    <div key={tool.id} className="bg-green-950/50 border border-green-800/50 rounded-lg p-4 flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div>
                        <div className="font-bold text-green-100">{tool.name}</div>
                        <div className="text-xs text-green-400">{tool.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}