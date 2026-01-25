'use client';

import { useState, useEffect } from 'react';

interface VPNThreat {
  tool: string;
  country: string;
  countryCode: string;
  status: 'BLOCKED' | 'WORKING' | 'ANOMALY';
  confidenceScore: number;
  method: string | string[];
  source: string | string[];
  lastChecked: string;
  recommendation: string;
}

export default function Dashboard() {
  const [vpnData, setVpnData] = useState<VPNThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedTool, setSelectedTool] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage('🔄 Syncing data from Apify...');
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const data = await response.json();
      setSyncMessage(`✅ Synced ${data.synced} records! Refreshing...`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setSyncMessage(`❌ Error: ${message}`);
      setSyncing(false);
    }
  };

  // Fetch data from backend API endpoint instead of Apify directly
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ FIX #1: Use your backend API endpoint instead of Apify
        const response = await fetch('/api/threats');

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ FIX #2: Extract data using fallback chain (handles multiple API formats)
        const vpnRecords = data.data || data.threats || [];

        if (!Array.isArray(vpnRecords)) {
          throw new Error('Invalid API response format');
        }

        // ✅ FIX #3: Map database fields to component interface with proper type casting
        const processedData: VPNThreat[] = vpnRecords.map((item: any) => {
          const status: 'BLOCKED' | 'WORKING' | 'ANOMALY' = item.blocked ? 'BLOCKED' : item.anomaly ? 'ANOMALY' : 'WORKING';
          return {
            tool: item.tool_name || item.tool_id || 'Unknown',
            country: item.country || 'Unknown',
            countryCode: item.country || 'Unknown',
            status,
            confidenceScore: (item.confidence || 0) * 100,
            method: Array.isArray(item.methods) ? item.methods : item.method || 'Unknown',
            source: Array.isArray(item.sources) ? item.sources : item.source || 'Unknown',
            lastChecked: item.last_updated || item.timestamp || new Date().toISOString(),
            recommendation: item.recommendation || (item.blocked ? 'Use alternative VPN' : 'Tool working normally')
          };
        });

        setVpnData(processedData);
        setError(null);

      } catch (err) {
        console.error('Failed to fetch VPN data:', err);
        const message = err instanceof Error ? err.message : 'Failed to load VPN data';
        setError(message);
        setVpnData([]);

      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get unique values for filters
  const countries = Array.from(
    new Set(vpnData.map(item => item.countryCode))
  ).sort();

  const tools = Array.from(
    new Set(vpnData.map(item => item.tool))
  ).sort();

  const statuses = ['BLOCKED', 'ANOMALY', 'WORKING'];

  // Filter data based on selections
  const filteredData = vpnData.filter(item => {
    const matchCountry = selectedCountry === 'ALL' || item.countryCode === selectedCountry;
    const matchTool = selectedTool === 'ALL' || item.tool === selectedTool;
    const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchCountry && matchTool && matchStatus;
  });

  // Calculate statistics
  const stats = {
    blocked: vpnData.filter(item => item.status === 'BLOCKED').length,
    anomaly: vpnData.filter(item => item.status === 'ANOMALY').length,
    working: vpnData.filter(item => item.status === 'WORKING').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
              🔐 VPN Censorship Intelligence
            </h1>
            <p className="text-slate-300">
              Real-time monitoring of 35+ VPN tools across 195 countries
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            {syncing ? '🔄 Syncing...' : '🔄 Sync Data'}
          </button>
        </div>

        {syncMessage && (
          <div className={`mb-4 p-3 rounded-lg border ${
            syncMessage.includes('Error') 
              ? 'bg-red-500/10 border-red-500/50 text-red-200' 
              : 'bg-blue-500/10 border-blue-500/50 text-blue-200'
          }`}>
            {syncMessage}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">⏳ Loading VPN censorship data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">⚠️ Error: {error}</p>
            <p className="text-red-200 text-sm mt-1">
              Please check your internet connection and refresh the page.
            </p>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && vpnData.length > 0 && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Total Records</p>
                <p className="text-3xl font-bold text-white">{vpnData.length}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 text-sm mb-1">🔴 Blocked</p>
                <p className="text-3xl font-bold text-red-300">{stats.blocked}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                <p className="text-yellow-300 text-sm mb-1">⚠️ Anomalies</p>
                <p className="text-3xl font-bold text-yellow-300">{stats.anomaly}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-300 text-sm mb-1">✅ Working</p>
                <p className="text-3xl font-bold text-green-300">{stats.working}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full appearance-none bg-slate-600 text-white px-4 py-2 pr-8 rounded border border-slate-500 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Countries ({countries.length})</option>
                      {countries.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none">▼</div>
                  </div>
                </div>

                {/* Tool Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    VPN Tool
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="w-full appearance-none bg-slate-600 text-white px-4 py-2 pr-8 rounded border border-slate-500 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Tools ({tools.length})</option>
                      {tools.map(tool => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none">▼</div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none bg-slate-600 text-white px-4 py-2 pr-8 rounded border border-slate-500 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Status</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status} ({vpnData.filter(item => item.status === status).length})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none">▼</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-600 border-b border-slate-500">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Tool</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Country</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Confidence</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Last Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, idx) => (
                        <tr
                          key={`${item.tool}-${item.country}-${idx}`}
                          className="border-b border-slate-600 hover:bg-slate-600/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-slate-100">{item.tool}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300">{item.countryCode}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                item.status === 'BLOCKED'
                                  ? 'bg-red-500/20 text-red-300'
                                  : item.status === 'ANOMALY'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-green-500/20 text-green-300'
                              }`}
                            >
                              {item.status === 'BLOCKED' && '🔴'} {item.status === 'ANOMALY' && '⚠️'} {item.status === 'WORKING' && '✅'} {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300">{item.confidenceScore.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300 text-sm">
                              {Array.isArray(item.method) ? item.method.join(', ') : item.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-400 text-sm">
                              {new Date(item.lastChecked).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <p className="text-slate-400">No records match your filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 text-center text-slate-400 text-sm">
              <p>
                Showing {filteredData.length} of {vpnData.length} records
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && vpnData.length === 0 && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No VPN censorship data found</p>
            <p className="text-slate-500 text-sm">
              The backend API might not have data yet. Check your Apify sync status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
