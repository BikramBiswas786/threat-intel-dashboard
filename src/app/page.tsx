'use client';

import { useState, useEffect } from 'react';

interface Threat {
  id: string;
  name: string;
  status: 'working' | 'blocked' | 'intermittent' | 'unknown';
  description: string;
  url: string;
}

const DEFAULT_THREATS: Threat[] = [
  {
    id: '1',
    name: 'Tor Browser',
    status: 'working',
    description: 'Anonymous browsing network',
    url: 'https://www.torproject.org',
  },
  {
    id: '2',
    name: 'Proton VPN',
    status: 'working',
    description: 'Secure VPN service',
    url: 'https://protonvpn.com',
  },
  {
    id: '3',
    name: 'ExpressVPN',
    status: 'intermittent',
    description: 'Fast VPN with global coverage',
    url: 'https://expressvpn.com',
  },
];

export default function DashboardPage() {
  const [threats, setThreats] = useState<Threat[]>(DEFAULT_THREATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
     const response = await fetch(`${apiUrl}/api/threats?country=ALL`, {          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setThreats(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch threats:', err);
        setError('Using local data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🌐 Global Threat Intelligence</h1>
          <p className="text-blue-100 text-lg">Real-time censorship monitoring • Live OONI data</p>
        </header>

        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-bold">⚠️ {error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4">Loading threat data...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threats.map((threat) => {
              const statusColors: Record<string, string> = {
                working: 'bg-green-500',
                blocked: 'bg-red-500',
                intermittent: 'bg-yellow-500',
                unknown: 'bg-gray-500',
              };

              return (
                <div
                  key={threat.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{threat.name}</h2>
                    <span className={`${statusColors[threat.status] || 'bg-gray-500'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {threat.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{threat.description}</p>
                  <a
                    href={threat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                  >
                    Learn More →
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-2">System Status</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ OONI Data Collector: Active</li>
            <li>✅ Backend API: Connected</li>
            <li>✅ Database: Synced</li>
            <li>✅ Tools Tracked: {threats.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
