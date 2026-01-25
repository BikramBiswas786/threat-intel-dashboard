'use client';
import { useState, useEffect } from 'react';

interface VPNData {
  tool: string;
  country: string;
  countryCode: string;
  status: 'BLOCKED' | 'WORKING' | 'ANOMALY';
  confidenceScore: number;
  method?: string;
  source: string;
  lastChecked: string;
  recommendation?: string;
}

const COUNTRIES = [
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'IR', name: 'Iran' },
  { code: 'TR', name: 'Turkey' },
  { code: 'AE', name: 'UAE' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'SY', name: 'Syria' },
  { code: 'CU', name: 'Cuba' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TH', name: 'Thailand' },
];

const VPN_TOOLS = [
  'nymvpn', 'tor', 'protonvpn', 'nordvpn', 'expressvpn', 
  'surfshark', 'mullvad', 'windscribe', 'ipvanish', 'cyberghost'
];

export default function DashboardPage() {
  const [vpnData, setVpnData] = useState<VPNData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'BLOCKED' | 'ANOMALY' | 'WORKING'>('BLOCKED');

  useEffect(() => {
    fetchVPNData();
  }, []);

  const fetchVPNData = async () => {
    setLoading(true);
    try {
      // Use environment variable or fallback to a default dataset
      const datasetId = process.env.NEXT_PUBLIC_APIFY_DATASET_ID || 'zO9mCVWlKxPd5qhaE';
      const apiToken = process.env.NEXT_PUBLIC_APIFY_API_TOKEN || '';
      const apiUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?format=json&clean=true${apiToken ? `&token=${apiToken}` : ''}`;
      
      console.log('[VPN Data] Fetching from:', apiUrl);
      const response = await fetch(apiUrl);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data is an error object
      if (data.error) {
        throw new Error(data.message || 'Dataset not found');
      }
      
      console.log('[VPN Data] Loaded:', data.length, 'records');
      
      // Extract VPN data safely with fallback chain
      const vpnList = data?.data || data?.threats || [];
      
      // Validate it's actually an array
      if (Array.isArray(vpnList)) {
        setVpnData(vpnList);
      } else {
        console.warn('Invalid VPN data structure:', data);
        setVpnData([]);
      }
      
    } catch (error) {
      console.error('[VPN Data] Error:', error);
      setVpnData([]);
    }
    setLoading(false);
  };

  const filteredData = vpnData.filter(item => {
    const statusMatch = item.status === activeTab;
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(item.countryCode);
    const toolMatch = selectedTools.length === 0 || selectedTools.includes(item.tool.toLowerCase());
    return statusMatch && countryMatch && toolMatch;
  });

  const blockedCount = vpnData.filter(d => d.status === 'BLOCKED').length;
  const anomalyCount = vpnData.filter(d => d.status === 'ANOMALY').length;
  const workingCount = vpnData.filter(d => d.status === 'WORKING').length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">🛡️ VPN Censorship Intelligence</h1>
        <p className="text-purple-100">Real-time VPN blocking data from 13 sources • 195 countries • 35+ tools tracked</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filter Panel */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-slate-100">🔍 Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Countries */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Countries</label>
              <select
                multiple
                value={selectedCountries}
                onChange={(e) => setSelectedCountries(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full border border-gray-600 bg-slate-700 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 min-h-[140px]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">Ctrl+Click to select multiple</p>
            </div>

            {/* VPN Tools */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">VPN Tools</label>
              <select
                multiple
                value={selectedTools}
                onChange={(e) => setSelectedTools(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full border border-gray-600 bg-slate-700 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 min-h-[140px]"
              >
                {VPN_TOOLS.map(tool => (
                  <option key={tool} value={tool}>{tool.toUpperCase()}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">Ctrl+Click to select multiple</p>
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Action</label>
              <button
                onClick={fetchVPNData}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? '⏳ Loading...' : '📊 Refresh Data'}
              </button>
              <p className="text-xs text-gray-400 mt-2">Total: {vpnData.length} records</p>
              <p className="text-xs text-gray-400">Filtered: {filteredData.length} results</p>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          {['BLOCKED', 'ANOMALY', 'WORKING'].map(tab => {
            const count = tab === 'BLOCKED' ? blockedCount : tab === 'ANOMALY' ? anomalyCount : workingCount;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-bold text-sm transition-colors ${
                  activeTab === tab
                    ? tab === 'BLOCKED'
                      ? 'border-b-4 border-red-600 text-red-400'
                      : tab === 'ANOMALY'
                      ? 'border-b-4 border-orange-600 text-orange-400'
                      : 'border-b-4 border-green-600 text-green-400'
                    : 'text-gray-400 hover:text-slate-100'
                }`}
              >
                {tab === 'BLOCKED' ? '🔴' : tab === 'ANOMALY' ? '🟠' : '🟢'} {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        {filteredData.length > 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-700 text-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">🛡️ VPN Tool</th>
                    <th className="px-4 py-3 text-left font-bold">🌍 Country</th>
                    <th className="px-4 py-3 text-left font-bold">📍 Status</th>
                    <th className="px-4 py-3 text-left font-bold">🎯 Confidence</th>
                    <th className="px-4 py-3 text-left font-bold">🔍 Method</th>
                    <th className="px-4 py-3 text-left font-bold">📡 Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 500).map((item, i) => (
                    <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-mono text-purple-400">{item.tool?.toUpperCase() || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-300">{item.country || 'Unknown'} ({item.countryCode || ''})</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.status === 'BLOCKED'
                            ? 'bg-red-900 text-red-300'
                            : item.status === 'ANOMALY'
                            ? 'bg-orange-900 text-orange-300'
                            : 'bg-green-900 text-green-300'
                        }`}>
                          {item.status === 'BLOCKED' ? '🔴 BLOCKED' : item.status === 'ANOMALY' ? '🟠 ANOMALY' : '🟢 WORKING'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                (item.confidenceScore || 0) >= 80
                                  ? 'bg-green-500'
                                  : (item.confidenceScore || 0) >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${item.confidenceScore || 0}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs">{item.confidenceScore || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{item.method || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{item.source || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-12 text-center text-slate-400">
            {loading ? '⏳ Loading VPN data...' : '❌ No VPN data found. Click Refresh Data button.'}
          </div>
        )}

        {filteredData.length > 500 && (
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-yellow-300 text-sm">
            ⚠️ Showing first 500 of {filteredData.length} results
          </div>
        )}
      </div>
    </div>
  );
}
