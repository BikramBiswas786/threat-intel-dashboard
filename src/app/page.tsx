'use client';

import { useState, useEffect } from 'react';

interface ThreatData {
  input: string | null;
  source: string;
  anomaly: boolean;
  country: string;
  failure: boolean;
  probeAsn: string;
  testName: string;
  confirmed: boolean;
  timestamp: string;
  probeCountryCode: string;
  measurementStartTime: string;
}

interface BackendResponse {
  data: ThreatData[];
}

export default function DashboardPage() {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://threat-dashboard-backend.vercel.app/api/threats?country=${country}`, { mode: 'cors' });
        if (res.ok) {
          const response: BackendResponse = await res.json();
          setThreats(response.data || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [country]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">🌐 Internet Censorship Check</h1>
            <p className="text-xl opacity-90">Check if VPNs, websites, and messaging apps work in your country</p>
          </div>
          <div className="bg-red-500 text-white p-4 text-center font-bold text-lg">🔴 LIVE DATA: Real-time censorship monitoring from OONI Explorer</div>
          
          <div className="p-8">
            <div className="bg-gray-100 p-6 rounded-xl mb-8 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-3 uppercase tracking-wide">🌍 Select Your Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:border-purple-600 text-gray-800 font-semibold">
                    <option value="ALL">🌐 All Countries</option>
                    <option value="IR">🇮🇷 Iran</option>
                    <option value="CN">🇨🇳 China</option>
                    <option value="RU">🇷🇺 Russia</option>
                    <option value="KP">🇰🇵 North Korea</option>
                    <option value="SY">🇸🇾 Syria</option>
                    <option value="CU">🇨🇺 Cuba</option>
                    <option value="VN">🇻🇳 Vietnam</option>
                    <option value="TH">🇹🇭 Thailand</option>
                    <option value="IN">🇮🇳 India</option>
                  </select>
                </div>
                <div className="text-gray-700 font-semibold">
                  {loading ? '⏳ Loading...' : `✅ Data loaded: ${threats.length} tests found`}
                </div>
              </div>
            </div>

            {threats.length > 0 && (
              <>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
                  <p className="text-sm font-bold uppercase opacity-90 mb-2">Last Check</p>
                  <p className="text-2xl font-bold">{new Date(threats[0].timestamp).toLocaleString()}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-6 py-4 text-left font-bold text-sm uppercase">🛡 Tool/Service</th>
                        <th className="px-6 py-4 text-left font-bold text-sm uppercase">📊 Tests</th>
                        <th className="px-6 py-4 text-left font-bold text-sm uppercase">🚀 Speed</th>
                        <th className="px-6 py-4 text-left font-bold text-sm uppercase">📈 Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threats.slice(0, 50).map((threat, idx) => {
                        const statusColor = threat.anomaly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
                        const statusLabel = threat.anomaly ? '🔴 BLOCKED' : '✅ WORKING';
                        return (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 font-bold text-gray-800">{threat.testName}</td>
                            <td className="px-6 py-4 text-gray-700">{threat.source}</td>
                            <td className="px-6 py-4 text-gray-700">{threat.country}</td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full font-bold text-sm ${statusColor}`}>{statusLabel}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {!loading && threats.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No data available for the selected country.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
