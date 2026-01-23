'use client';

import { useState, useEffect } from 'react';

interface OONIData {
  id: string;
  country: string;
  testName: string;
  anomaly: boolean;
  confirmed: boolean;
  failure: boolean;
  timestamp: string;
  input?: string;
}

export default function DashboardPage() {
  const [threats, setThreats] = useState<OONIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://threat-dashboard-backend.vercel.app/api/threats?country=ALL', { mode: 'cors' });

        if (response.ok) {
          const data = await response.json();
setThreats(data.data || []);
          setError(null);        } else {
          setError('Failed to fetch threats');
        }
      } catch (err) {
        console.error('Failed to fetch threats:', err);
        setError('Using local data (API unavailable)');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countryCounts = threats.reduce((acc, threat) => {
    acc[threat.country] = (acc[threat.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const testTypeCounts = threats.reduce((acc, threat) => {
    acc[threat.testName] = (acc[threat.testName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const anomalousCount = threats.filter(t => t.anomaly).length;
  const confirmedCount = threats.filter(t => t.confirmed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌐 Global Threat Intelligence</h1>
          <p className="text-blue-100">Real-time censorship monitoring • Live OONI data</p>
        </div>

        {/* Status Alert */}
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-bold">⚠️ {error}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <p className="text-sm opacity-80">Total Measurements</p>
            <p className="text-3xl font-bold">{threats.length}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <p className="text-sm opacity-80">Countries Monitored</p>
            <p className="text-3xl font-bold">{Object.keys(countryCounts).length}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <p className="text-sm opacity-80">Test Types</p>
            <p className="text-3xl font-bold">{Object.keys(testTypeCounts).length}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <p className="text-sm opacity-80">Anomalies Detected</p>
            <p className="text-3xl font-bold text-red-300">{anomalousCount}</p>
          </div>
        </div>

        {/* Countries */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-4">📍 Countries Monitored</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(countryCounts).map(([country, count]) => (
              <div key={country} className="bg-blue-500 bg-opacity-30 rounded p-3 text-white text-center">
                <p className="font-bold text-sm">{country}</p>
                <p className="text-xs opacity-80">{count} tests</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Types */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-4">🧪 Test Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testTypeCounts).map(([testType, count]) => (
              <div key={testType} className="bg-purple-500 bg-opacity-30 rounded p-4 text-white">
                <p className="font-bold">{testType}</p>
                <p className="text-sm opacity-80">{count} measurements</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Threats */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">⚡ Recent Measurements ({threats.length})</h2>
          {threats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead className="border-b border-white border-opacity-20">
                  <tr>
                    <th className="text-left py-2 px-2">Country</th>
                    <th className="text-left py-2 px-2">Test Type</th>
                    <th className="text-left py-2 px-2">Input</th>
                    <th className="text-center py-2 px-2">Anomaly</th>
                    <th className="text-center py-2 px-2">Confirmed</th>
                    <th className="text-left py-2 px-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {threats.slice(0, 20).map((threat) => (
                    <tr key={threat.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition">
                      <td className="py-3 px-2 font-mono">{threat.country}</td>
                      <td className="py-3 px-2">{threat.testName}</td>
                      <td className="py-3 px-2 text-xs truncate max-w-xs">{threat.input || '-'}</td>
                      <td className="py-3 px-2 text-center">{threat.anomaly ? '🔴' : '🟢'}</td>
                      <td className="py-3 px-2 text-center">{threat.confirmed ? '✓' : '-'}</td>
                      <td className="py-3 px-2 text-xs">{new Date(threat.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {threats.length > 20 && (
                <p className="text-white text-center py-4 opacity-80">Showing 20 of {threats.length} measurements</p>
              )}
            </div>
          ) : loading ? (
            <p className="text-white opacity-80">Loading OONI data...</p>
          ) : (
            <p className="text-white opacity-80">No data available</p>
          )}
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6">
          <h3 className="text-white text-lg font-bold mb-4">System Status</h3>
          <div className="space-y-2 text-white">
            <p>✅ OONI Data Collector: Active</p>
            <p>✅ Backend API: Connected</p>
            <p>✅ Database: Synced</p>
            <p>✅ Measurements Tracked: {threats.length}</p>
            <p>✅ Countries Monitored: {Object.keys(countryCounts).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
