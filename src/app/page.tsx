'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AlertCircle, TrendingUp, Globe, Lock, Search } from 'lucide-react';

interface VPNData {
  name: string;
  blocked: number;
  sources: string[];
  regions: string[];
  lastUpdated: string;
  confidence: number;
}

interface CountryData {
  name: string;
  vpnsBanned: number;
  sources: string[];
  bannedTools: VPNData[];
}

export default function VPNCensorshipDashboard() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual API calls
  const censorsedData: CountryData[] = [
    {
      name: 'China',
      vpnsBanned: 15,
      sources: ['OONI', 'Great Firewall reports', 'Freedom House'],
      bannedTools: [
        {
          name: 'ExpressVPN',
          blocked: 1,
          sources: ['OONI', 'Great Firewall'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-20',
          confidence: 98,
        },
        {
          name: 'NordVPN',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-22',
          confidence: 95,
        },
        {
          name: 'ProtonVPN',
          blocked: 1,
          sources: ['Great Firewall reports'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-25',
          confidence: 92,
        },
        {
          name: 'Shadowsocks',
          blocked: 1,
          sources: ['OONI', 'Great Firewall'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-21',
          confidence: 99,
        },
      ],
      bannedTools: [
        {
          name: 'ExpressVPN',
          blocked: 1,
          sources: ['OONI', 'Great Firewall'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-20',
          confidence: 98,
        },
        {
          name: 'NordVPN',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-22',
          confidence: 95,
        },
        {
          name: 'ProtonVPN',
          blocked: 1,
          sources: ['Great Firewall reports'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-25',
          confidence: 92,
        },
        {
          name: 'Shadowsocks',
          blocked: 1,
          sources: ['OONI', 'Great Firewall'],
          regions: ['Mainland China'],
          lastUpdated: '2026-01-21',
          confidence: 99,
        },
      ],
    },
    {
      name: 'Iran',
      vpnsBanned: 12,
      sources: ['Netblocks', 'OONI', 'Citizen Lab'],
      bannedTools: [
        {
          name: 'ExpressVPN',
          blocked: 1,
          sources: ['Netblocks'],
          regions: ['Iran'],
          lastUpdated: '2026-01-18',
          confidence: 97,
        },
        {
          name: 'Hotspot Shield',
          blocked: 1,
          sources: ['Netblocks', 'OONI'],
          regions: ['Iran'],
          lastUpdated: '2026-01-23',
          confidence: 93,
        },
        {
          name: 'TunnelBear',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Iran'],
          lastUpdated: '2026-01-19',
          confidence: 88,
        },
      ],
    },
    {
      name: 'Russia',
      vpnsBanned: 8,
      sources: ['OONI', 'Roskomnadzor'],
      bannedTools: [
        {
          name: 'ExpressVPN',
          blocked: 1,
          sources: ['Roskomnadzor'],
          regions: ['Russia'],
          lastUpdated: '2026-01-17',
          confidence: 94,
        },
        {
          name: 'NordVPN',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Russia'],
          lastUpdated: '2026-01-24',
          confidence: 91,
        },
      ],
    },
    {
      name: 'Venezuela',
      vpnsBanned: 10,
      sources: ['Netblocks', 'Citizen Lab'],
      bannedTools: [
        {
          name: 'ProtonVPN',
          blocked: 1,
          sources: ['Netblocks'],
          regions: ['Venezuela'],
          lastUpdated: '2026-01-16',
          confidence: 90,
        },
        {
          name: 'CyberGhost',
          blocked: 1,
          sources: ['Citizen Lab'],
          regions: ['Venezuela'],
          lastUpdated: '2026-01-20',
          confidence: 86,
        },
      ],
    },
    {
      name: 'Belarus',
      vpnsBanned: 11,
      sources: ['OONI', 'Netblocks'],
      bannedTools: [
        {
          name: 'NordVPN',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Belarus'],
          lastUpdated: '2026-01-19',
          confidence: 92,
        },
        {
          name: 'ExpressVPN',
          blocked: 1,
          sources: ['Netblocks'],
          regions: ['Belarus'],
          lastUpdated: '2026-01-21',
          confidence: 89,
        },
        {
          name: 'ProtonVPN',
          blocked: 1,
          sources: ['OONI'],
          regions: ['Belarus'],
          lastUpdated: '2026-01-25',
          confidence: 87,
        },
      ],
    },
  ];

  const filteredCountries = useMemo(() => {
    return censorsedData.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const chartData = useMemo(() => {
    return filteredCountries.map((country) => ({
      name: country.name,
      vpnsBanned: country.vpnsBanned,
    }));
  }, [filteredCountries]);

  const pieData = useMemo(() => {
    if (!selectedCountry) return [];
    return selectedCountry.bannedTools.map((tool) => ({
      name: tool.name,
      value: 1,
    }));
  }, [selectedCountry]);

  const handleCountrySelect = useCallback((country: CountryData) => {
    setSelectedCountry(country);
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Global VPN Censorship Tracker</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Global VPN censorship tracking • 26 countries • 17 VPN tools • 97+ ban events
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Data sources: 50+ independent monitors • Last updated: January 26, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Countries List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Affected Countries
            </h2>
            <div className="space-y-2">
              {filteredCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCountry?.name === country.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{country.name}</span>
                    <span className="text-sm bg-slate-600 px-2 py-1 rounded">
                      {country.vpnsBanned}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Charts and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bar Chart */}
            <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">VPNs Banned by Country</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="vpnsBanned" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Country Details */}
            {selectedCountry && (
              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Banned Tools in {selectedCountry.name}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name }) => name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Tools Blocked in {selectedCountry.name}
                  </h3>
                  <div className="space-y-3">
                    {selectedCountry.bannedTools.map((tool) => (
                      <div
                        key={tool.name}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{tool.name}</h4>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              tool.confidence >= 95
                                ? 'bg-green-500/20 text-green-300'
                                : tool.confidence >= 85
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-orange-500/20 text-orange-300'
                            }`}
                          >
                            {tool.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">
                          Last updated: {tool.lastUpdated}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tool.sources.map((source) => (
                            <span
                              key={source}
                              className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-slate-300">
                          Regions: {tool.regions.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alert Box */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-300 mb-1">
                      {selectedCountry.vpnsBanned} VPN Services Reported Blocked
                    </h4>
                    <p className="text-sm text-red-300/80">
                      These tools are reported blocked in {selectedCountry.name} based on data
                      from {selectedCountry.sources.length} independent sources:
                    </p>
                    <p className="text-xs text-red-300/60 mt-2">
                      {selectedCountry.sources.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="bg-slate-700/20 border border-slate-700 rounded-lg p-4 mt-8">
              <div className="flex gap-2 items-start mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Sources & Methodology</h4>
                  <p className="text-sm text-slate-4