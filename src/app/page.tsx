'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

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
    { id: 10, name: "Outline VPN", category: "Circumvention", price: "Free", blocked_in: ["CN", "IR"], working_in: ["US", "UK"], slow_in: ["RU"], confidence: 0.72, days_until_block: 127 }
  ],
  countries: [
    { code: "CN", name: "China", flag: "🇨🇳", risk: "CRITICAL", blocked: 10, slow: 5, working: 5 },
    { code: "IR", name: "Iran", flag: "🇮🇷", risk: "CRITICAL", blocked: 9, slow: 3, working: 3 },
    { code: "RU", name: "Russia", flag: "🇷🇺", risk: "HIGH", blocked: 4, slow: 5, working: 6 },
    { code: "KP", name: "North Korea", flag: "🇰🇵", risk: "EXTREME", blocked: 3, slow: 0, working: 0 },
    { code: "TR", name: "Turkey", flag: "🇹🇷", risk: "MEDIUM", blocked: 0, slow: 4, working: 6 }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">🌍 VPN Ban Intelligence</h1>
          <p className="text-slate-400">97 ban events • 5 countries • 10 VPN tools</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">📍 Countries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            {VPN_BAN_DATA.countries.map(c => (
              <button key={c.code} onClick={() => setSelected(c)} className={`p-3 rounded-lg border-2 text-left transition ${selected?.code === c.code ? 'bg-red-900 border-red-600' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl">{c.flag}</div>
                    <div className={`font-bold text-sm ${selected?.code === c.code ? 'text-red-200' : 'text-white'}`}>{c.name}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${c.risk === 'EXTREME' ? 'bg-red-600' : c.risk === 'CRITICAL' ? 'bg-red-700' : 'bg-orange-700'} text-white`}>{c.risk}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-3">{selected.flag} {selected.name} - VPN Status</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-900/40 border border-red-700/50 rounded p-3">
                  <div className="text-red-300 text-sm">🔴 Blocked</div>
                  <div className="text-2xl font-bold text-red-100">{blocked.length}</div>
                </div>
                <div className="bg-yellow-900/40 border border-yellow-700/50 rounded p-3">
                  <div className="text-yellow-300 text-sm">🟠 Slow</div>
                  <div className="text-2xl font-bold text-yellow-100">{slow.length}</div>
                </div>
                <div className="bg-green-900/40 border border-green-700/50 rounded p-3">
                  <div className="text-green-300 text-sm">🟢 Working</div>
                  <div className="text-2xl font-bold text-green-100">{working.length}</div>
                </div>
              </div>
            </div>

            {blocked.length > 0 && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-200 mb-3">🔴 Blocked ({blocked.length})</h3>
                <div className="space-y-2">
                  {blocked.map(tool => (
                    <div key={tool.id} className="bg-red-950/50 border border-red-800/30 rounded p-3">
                      <div onClick={() => { const s = new Set(expanded); s.has(tool.id) ? s.delete(tool.id) : s.add(tool.id); setExpanded(s); }} className="cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-red-100">{tool.name}</div>
                            <div className="text-xs text-red-400">{tool.category} • {tool.price}</div>
                          </div>
                          <div className="text-right text-xs text-red-400">
                            <div>⚠️ {tool.days_until_block}d</div>
                            <div>{Math.round(tool.confidence * 100)}%</div>
                          </div>
                        </div>
                      </div>
                      {expanded.has(tool.id) && (
                        <div className="mt-2 text-xs text-red-300 border-t border-red-800/50 pt-2">
                          <div>Blocked: {tool.blocked_in.join(', ')}</div>
                          <div>Working: {tool.working_in.join(', ')}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slow.length > 0 && (
              <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-200 mb-3">🟠 Slow ({slow.length})</h3>
                <div className="space-y-2">
                  {slow.map(tool => (
                    <div key={tool.id} className="bg-yellow-950/50 border border-yellow-800/30 rounded p-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-bold text-yellow-100">{tool.name}</div>
                          <div className="text-xs text-yellow-400">{tool.category}</div>
                        </div>
                        <div className="text-xs text-yellow-400">{Math.round(tool.confidence * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {working.length > 0 && (
              <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-200 mb-3">🟢 Working ({working.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {working.map(tool => (
                    <div key={tool.id} className="bg-green-950/50 border border-green-800/30 rounded p-3">
                      <div className="font-bold text-green-100">{tool.name}</div>
                      <div className="text-xs text-green-400">{tool.category}</div>
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
