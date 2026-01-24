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
  category?: string;
  block_type?: string;
}

export default function DashboardPage() {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState(['ALL']);
  const [categories, setCategories] = useState(['ALL']);
  const [status, setStatus] = useState('ALL');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');
  const [activeTab, setActiveTab] = useState('BLOCKED');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countries.length > 0 && !countries.includes('ALL')) params.append('country', countries.join(','));
      if (categories.length > 0 && !categories.includes('ALL')) params.append('category', categories.join(','));
      if (status !== 'ALL') params.append('status', status);
      if (since) params.append('since', since);
      if (until) params.append('until', until);

      const res = await fetch(`https://threat-dashboard-backend.vercel.app/api/threats?${params.toString()}`);
      const response = await res.json();
      setThreats(response.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredThreats = threats.filter(t => {
    if (activeTab === 'BLOCKED') return t.confirmed || t.anomaly;
    if (activeTab === 'WORKING') return !t.anomaly && !t.confirmed && !t.failure;
    if (activeTab === 'ANOMALIES') return t.anomaly && !t.confirmed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Threat Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time OONI censorship measurements and network interference detection.</p>
        </header>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nations</label>
              <select 
                multiple 
                value={countries} 
                onChange={(e) => setCountries(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              >
                <option value="ALL">All Countries</option>
                <option value="CN">China (CN)</option>
                <option value="IN">India (IN)</option>
                <option value="IR">Iran (IR)</option>
                <option value="RU">Russia (RU)</option>
                <option value="SY">Syria (SY)</option>
                <option value="CU">Cuba (CU)</option>
                <option value="VN">Vietnam (VN)</option>
                <option value="TH">Thailand (TH)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
              <select 
                multiple
                value={categories}
                onChange={(e) => setCategories(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              >
                <option value="ALL">All Categories</option>
                <option value="VPN">VPN / Circumvention</option>
                <option value="SOCIAL">Social & Messaging</option>
                <option value="NEWS">News & Media</option>
                <option value="PORN">Pornography</option>
                <option value="CRYPTO">Crypto / Finance</option>
                <option value="SEARCH">Search Engines</option>
                <option value="POLITICAL">Political / Human Rights</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex flex-col gap-2">
                <button onClick={() => setStatus('BLOCKED')} className={`px-4 py-2 rounded-lg font-bold text-sm ${status === 'BLOCKED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>🔴 BLOCKED</button>
                <button onClick={() => setStatus('ANOMALY')} className={`px-4 py-2 rounded-lg font-bold text-sm ${status === 'ANOMALY' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}>🟠 ANOMALY</button>
                <button onClick={() => setStatus('WORKING')} className={`px-4 py-2 rounded-lg font-bold text-sm ${status === 'WORKING' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>🟢 WORKING</button>
                <button onClick={() => setStatus('ALL')} className={`px-4 py-2 rounded-lg font-bold text-sm ${status === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>ALL STATUS</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Range</label>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => {
                    const d = new Date(); d.setHours(d.getHours() - 24);
                    setSince(d.toISOString());
                  }} className="text-xs bg-gray-200 px-2 py-1 rounded">Last 24h</button>
                  <button onClick={() => {
                    const d = new Date(); d.setDate(d.getDate() - 7);
                    setSince(d.toISOString());
                  }} className="text-xs bg-gray-200 px-2 py-1 rounded">7 Days</button>
                </div>
                <input type="datetime-local" value={since.split('.')[0]} onChange={(e) => setSince(new Date(e.target.value).toISOString())} className="w-full text-xs border-gray-300 rounded" />
                <button onClick={fetchData} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading ? 'Loading...' : 'Apply Filters'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          {['BLOCKED', 'WORKING', 'ANOMALIES'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-bold transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab} ({threats.filter(t => {
                if (tab === 'BLOCKED') return t.confirmed || t.anomaly;
                if (tab === 'WORKING') return !t.anomaly && !t.confirmed && !t.failure;
                if (tab === 'ANOMALIES') return t.anomaly && !t.confirmed;
                return false;
              }).length})
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">URL / Domain</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Tested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredThreats.slice(0, 100).map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{t.probeCountryCode}</span>
                        <span className="text-gray-500 text-xs">{t.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {t.testName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600" title={t.input || ''}>
                        {t.input || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.confirmed ? 'bg-red-100 text-red-800' : 
                        t.anomaly ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {t.confirmed ? 'BLOCKED' : t.anomaly ? 'ANOMALY' : 'WORKING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(t.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredThreats.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500">
              No results found matching your current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
