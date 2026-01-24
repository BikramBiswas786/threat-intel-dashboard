'use client';
import { useState, useEffect } from 'react';

interface ThreatData {
  id?: string;
  input: string | null;
  source: string;
  anomaly: boolean;
  country: string;
  probe_country_code: string;
  country_code?: string;
  failure: boolean | null;
  probe_asn: string | null;
  test_name: string;
  confirmed: boolean;
  timestamp: string;
  created_at?: string;
  category?: string;
  status?: string;
  block_type?: string;
}

const COUNTRIES = [
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'IR', name: 'Iran' },
  { code: 'RU', name: 'Russia' },
  { code: 'SY', name: 'Syria' },
  { code: 'CU', name: 'Cuba' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TH', name: 'Thailand' },
  { code: 'KP', name: 'North Korea' },
  { code: 'BY', name: 'Belarus' },
];

const CATEGORIES = ['VPN', 'SOCIAL', 'NEWS', 'PORN', 'CRYPTO', 'SEARCH', 'POLITICAL', 'OTHER'];

export default function DashboardPage() {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeTab, setActiveTab] = useState('BLOCKED');

  useEffect(() => {
    // Auto-fetch on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (selectedCountries.length > 0) {
        params.append('country', selectedCountries.join(','));
      }
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }
      if (selectedStatus !== 'ALL') {
        params.append('status', selectedStatus);
      }

      const url = `https://threat-dashboard-backend.vercel.app/api/threats?${params.toString()}`;
      console.log('[FETCH] URL:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      console.log('[FETCH] Response:', data);
      setThreats(data.data || []);
    } catch (error) {
      console.error('[FETCH] Error:', error);
    }
    setLoading(false);
  };

  const filteredThreats = threats.filter(t => {
    if (activeTab === 'BLOCKED') return t.confirmed;
    if (activeTab === 'ANOMALY') return t.anomaly && !t.confirmed;
    if (activeTab === 'WORKING') return !t.anomaly && !t.confirmed && !t.failure;
    return true;
  });

  const getStatusColor = (threat: ThreatData) => {
    if (threat.confirmed) return 'bg-red-100 text-red-800';
    if (threat.anomaly) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusLabel = (threat: ThreatData) => {
    if (threat.confirmed) return '🔴 BLOCKED';
    if (threat.anomaly) return '🟠 ANOMALY';
    return '🟢 WORKING';
  };

  const getDomain = (url: string | null) => {
    if (!url) return 'N/A';
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url.split('/')[0];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">Global Internet Censorship Monitor</h1>
        <p className="text-blue-100">Real-time OONI threat intelligence dashboard</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filter Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">🔍 Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Countries */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Countries</label>
              <select
                multiple
                value={selectedCountries}
                onChange={(e) => setSelectedCountries(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 min-h-[140px]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Ctrl+Click to select multiple</p>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Categories</label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 min-h-[140px]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Ctrl+Click to select multiple</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
              <div className="space-y-2">
                {['ALL', 'BLOCKED', 'ANOMALY', 'WORKING'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      selectedStatus === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'BLOCKED' ? '🔴' : s === 'ANOMALY' ? '🟠' : s === 'WORKING' ? '🟢' : '⚪'} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Load Data */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Action</label>
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳ Loading...' : '📊 Load Data'}
              </button>
              <p className="text-xs text-gray-500 mt-2">Total: {filteredThreats.length} records</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300 mb-6 bg-white rounded-t-lg p-4">
          {['BLOCKED', 'ANOMALY', 'WORKING'].map(tab => {
            const count = threats.filter(t => {
              if (tab === 'BLOCKED') return t.confirmed;
              if (tab === 'ANOMALY') return t.anomaly && !t.confirmed;
              if (tab === 'WORKING') return !t.anomaly && !t.confirmed && !t.failure;
              return false;
            }).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-bold text-sm transition-colors ${
                  activeTab === tab
                    ? tab === 'BLOCKED' ? 'border-b-4 border-red-600 text-red-600'
                    : tab === 'ANOMALY' ? 'border-b-4 border-orange-600 text-orange-600'
                    : 'border-b-4 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'BLOCKED' ? '🔴' : tab === 'ANOMALY' ? '🟠' : '🟢'} {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        {filteredThreats.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">🌍 Nation</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">📂 Category</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">🔗 Full URL</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">🌐 Domain</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">📍 Status</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">🕐 Last Tested</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThreats.slice(0, 500).map((t, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{t.probe_country_code}</td>
                      <td className="px-4 py-3"><span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">{t.test_name}</span></td>
                      <td className="px-4 py-3">
                        <a href={t.input && t.input.startsWith('http') ? t.input : `https://${t.input}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block">
                          {t.input || 'N/A'}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{getDomain(t.input)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(t)}`}>
                          {getStatusLabel(t)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(t.timestamp || t.created_at || '').toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            {loading ? '⏳ Loading threats...' : '❌ No threats found. Try adjusting your filters.'}
          </div>
        )}

        {filteredThreats.length > 500 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text>
            <p className="text-sm text-yellow-800">⚠️ Showing first 500 of {filteredThreats.length} results</p>
          </div>
        )}
      </div>
    </div>
  );
}
