"use client";
import React, { useState } from "react";

const TOOLS = {
  NYM: { name: "NYM VPN", cat: "Mixnet", IR: { s: "WORKING", sp: 6.5, c: 87, r: 234 }, CN: { s: "SLOW", sp: 2.8, c: 71, r: 156 }, RU: { s: "WORKING", sp: 7.2, c: 89, r: 298 }, VE: { s: "WORKING", sp: 5.9, c: 82, r: 167 }, BY: { s: "WORKING", sp: 6.8, c: 85, r: 201 }, p: { d: 180, c: 58, r: "LOW" } },
  TOR: { name: "Tor Browser", cat: "Anonymity", IR: { s: "WORKING", sp: 3.2, c: 98, r: 1234 }, CN: { s: "BLOCKED", sp: 0, c: 95, r: 892 }, RU: { s: "WORKING", sp: 2.9, c: 96, r: 1045 }, VE: { s: "WORKING", sp: 3.5, c: 97, r: 678 }, BY: { s: "WORKING", sp: 3.1, c: 94, r: 523 }, p: { d: -1, c: 100, r: "NEVER" } },
  MULLVAD: { name: "Mullvad VPN", cat: "Commercial", IR: { s: "WORKING", sp: 8.5, c: 94, r: 892 }, CN: { s: "BLOCKED", sp: 0, c: 91, r: 567 }, RU: { s: "SLOW", sp: 2.3, c: 85, r: 423 }, VE: { s: "WORKING", sp: 7.8, c: 88, r: 345 }, BY: { s: "WORKING", sp: 8.2, c: 90, r: 456 }, p: { d: 45, c: 82, r: "MEDIUM" } },
  PROTON: { name: "ProtonVPN", cat: "Commercial", IR: { s: "BLOCKED", sp: 0, c: 94, r: 612 }, CN: { s: "BLOCKED", sp: 0, c: 96, r: 734 }, RU: { s: "SLOW", sp: 1.8, c: 78, r: 389 }, VE: { s: "WORKING", sp: 6.5, c: 85, r: 298 }, BY: { s: "SLOW", sp: 2.4, c: 81, r: 334 }, p: { d: 35, c: 72, r: "MEDIUM" } },
  EXPRESS: { name: "ExpressVPN", cat: "Commercial", IR: { s: "SLOW", sp: 2.1, c: 76, r: 567 }, CN: { s: "BLOCKED", sp: 0, c: 93, r: 823 }, RU: { s: "SLOW", sp: 1.9, c: 74, r: 445 }, VE: { s: "WORKING", sp: 7.2, c: 82, r: 356 }, BY: { s: "SLOW", sp: 2.3, c: 77, r: 289 }, p: { d: 21, c: 85, r: "HIGH" } },
  NORD: { name: "NordVPN", cat: "Commercial", IR: { s: "SLOW", sp: 1.5, c: 71, r: 423 }, CN: { s: "BLOCKED", sp: 0, c: 89, r: 678 }, RU: { s: "SLOW", sp: 1.7, c: 73, r: 389 }, VE: { s: "WORKING", sp: 6.8, c: 80, r: 298 }, BY: { s: "SLOW", sp: 2.1, c: 75, r: 267 }, p: { d: 28, c: 78, r: "MEDIUM" } },
  PSIPHON: { name: "Psiphon", cat: "Circumvention", IR: { s: "BLOCKED", sp: 0, c: 91, r: 478 }, CN: { s: "WORKING", sp: 4.2, c: 88, r: 645 }, RU: { s: "WORKING", sp: 3.8, c: 84, r: 389 }, VE: { s: "WORKING", sp: 5.1, c: 86, r: 267 }, BY: { s: "WORKING", sp: 4.5, c: 83, r: 312 }, p: { d: 60, c: 68, r: "MEDIUM" } },
  LANTERN: { name: "Lantern", cat: "Circumvention", IR: { s: "SLOW", sp: 1.5, c: 73, r: 345 }, CN: { s: "WORKING", sp: 3.8, c: 81, r: 512 }, RU: { s: "WORKING", sp: 4.2, c: 79, r: 298 }, VE: { s: "WORKING", sp: 4.8, c: 80, r: 234 }, BY: { s: "WORKING", sp: 4.1, c: 78, r: 267 }, p: { d: 75, c: 61, r: "LOW" } },
  SIGNAL: { name: "Signal", cat: "Messaging", IR: { s: "WORKING", sp: null, c: 99, r: 1534 }, CN: { s: "BLOCKED", sp: null, c: 97, r: 1123 }, RU: { s: "WORKING", sp: null, c: 98, r: 1298 }, VE: { s: "WORKING", sp: null, c: 99, r: 892 }, BY: { s: "WORKING", sp: null, c: 98, r: 756 }, p: { d: -1, c: 100, r: "NEVER" } }
};

export function Dashboard() {
  const [country, setCountry] = useState("IR");
  const tools = Object.values(TOOLS);
  const countries = [{c:"IR",n:"Iran",f:"🇮🇷"},{c:"CN",n:"China",f:"🇨🇳"},{c:"RU",n:"Russia",f:"🇷🇺"},{c:"VE",n:"Venezuela",f:"🇻🇪"},{c:"BY",n:"Belarus",f:"🇧🇾"}];
  
  const working = tools.filter(t => t[country]?.s === "WORKING");
  const slow = tools.filter(t => t[country]?.s === "SLOW");
  const blocked = tools.filter(t => t[country]?.s === "BLOCKED");
  
  const StatusCard = ({tool}) => {
    const d = tool[country];
    const col = d.s === "WORKING" ? "green" : d.s === "SLOW" ? "yellow" : "red";
    const icon = d.s === "WORKING" ? "✅" : d.s === "SLOW" ? "⚠️" : "❌";
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{tool.name}</h3>
            <span className="text-gray-400 text-sm">{tool.cat}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${col}-600`}>
            {icon} {d.s}
          </span>
        </div>
        {d.sp !== null && (
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Speed</span>
              <span className="text-white font-semibold">{d.sp} Mbps</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(d.sp/10)*100}%`}}></div>
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Confidence</span>
          <span className="text-white font-semibold">{d.c}%</span>
          <span className="text-gray-500 text-xs">({d.r} reports)</span>
        </div>
        {tool.p.d > 0 && (
          <div className={`mt-3 p-2 border rounded ${
            tool.p.r === "HIGH" ? "bg-red-900/20 border-red-700" :
            tool.p.r === "MEDIUM" ? "bg-yellow-900/20 border-yellow-700" :
            "bg-green-900/20 border-green-700"
          }`}>
            <p className={`text-sm ${
              tool.p.r === "HIGH" ? "text-red-400" :
              tool.p.r === "MEDIUM" ? "text-yellow-400" :
              "text-green-400"
            }`}>
              ⚠️ Predicted blocking in {tool.p.d} days ({tool.p.c}% confidence)
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl">🔍</div>
          <div>
            <h1 className="text-4xl font-bold">Threat Intelligence Dashboard</h1>
            <p className="text-gray-400">Real-time monitoring • 5 countries • {tools.length} tools tracked</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Country</h2>
          <div className="flex gap-4 flex-wrap">
            {countries.map(c => (
              <button
                key={c.c}
                onClick={() => setCountry(c.c)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  country === c.c
                    ? "bg-red-600 text-white scale-105"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {c.f} {c.n}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              ⚡ REAL-TIME STATUS - {countries.find(c => c.c === country)?.n.toUpperCase()}
            </h2>
            <div className="text-sm text-gray-400">
              Last updated: 32s ago • Next: 28s
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">{working.length}</div>
              <div className="text-gray-300">Working</div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">{slow.length}</div>
              <div className="text-gray-300">Slow/Throttled</div>
            </div>
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">{blocked.length}</div>
              <div className="text-gray-300">Blocked</div>
            </div>
          </div>
        </div>
        
        {working.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              ✅ WORKING ({working.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {working.map((t,i) => <StatusCard key={i} tool={t} />)}
            </div>
          </div>
        )}
        
        {slow.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              ⚠️ SLOW / THROTTLED ({slow.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slow.map((t,i) => <StatusCard key={i} tool={t} />)}
            </div>
          </div>
        )}
        
        {blocked.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              ❌ BLOCKED ({blocked.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blocked.map((t,i) => <StatusCard key={i} tool={t} />)}
            </div>
          </div>
        )}
        
        <div className="bg-gray-800 border border-yellow-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            📊 30-60 DAY PREDICTIONS
          </h2>
          <div className="space-y-3">
            {tools.filter(t => t.p.d > 0).sort((a,b) => a.p.d - b.p.d).map((t,i) => (
              <div key={i} className={`p-4 rounded-lg ${
                t.p.r === "HIGH" ? "bg-red-900/30 border border-red-700" :
                t.p.r === "MEDIUM" ? "bg-yellow-900/30 border border-yellow-700" :
                "bg-green-900/30 border border-green-700"
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{t.name}</span>
                    <span className={`ml-3 text-sm ${
                      t.p.r === "HIGH" ? "text-red-400" :
                      t.p.r === "MEDIUM" ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {t.p.d} days ({t.p.c}% confidence)
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    t.p.r === "HIGH" ? "bg-red-600" :
                    t.p.r === "MEDIUM" ? "bg-yellow-600" :
                    "bg-green-600"
                  }`}>
                    {t.p.r} RISK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
