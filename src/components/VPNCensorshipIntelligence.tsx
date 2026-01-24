// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';

interface VPNData {
  tool: string;
  country: string;
  status: 'BLOCKED' | 'WORKING' | 'ANOMALY';
  confidenceScore: number;
  lastChecked: string;
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
  // Add more countries as needed
];

export default function VPNCensorshipIntelligence() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [vpnData, setVpnData] = useState<VPNData[]>([]);
  const [loading, setLoading] = useState(false);
  const [nymStatus, setNymStatus] = useState<any>(null);

  const loadVPNData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.apify.com/v2/datasets/u9WvBXaces9N4TPCe/items?format=json&clean=true`
      );
      const data = await response.json();
      
      // Filter data for selected country
      const countryData = data.filter((item: VPNData) => item.country === selectedCountry);
      setVpnData(countryData);
      
      // Get Nym VPN status
      const nym = countryData.find((item: VPNData) => item.tool === 'nym');
      setNymStatus(nym);
    } catch (error) {
      console.error('Error loading VPN data:', error);
    } finally {
      setLoading(false);
    }
  };

  const blocked = vpnData.filter(item => item.status === 'BLOCKED');
  const working = vpnData.filter(item => item.status === 'WORKING');

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-4">🛡️ VPN Censorship Intelligence</h2>
      <p className="text-gray-300 mb-6">Real-time VPN blocking data from 13+ sources • 195 countries • 35+ tools tracked</p>
      
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={loadVPNData}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔍 Check VPN Status'}
        </button>
      </div>

      {vpnData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blocked VPNs */}
          <div className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              🚫 Blocked VPNs
              <span className="text-sm bg-red-500 px-2 py-1 rounded">{blocked.length}</span>
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {blocked.length === 0 ? (
                <p className="text-gray-400">✨ No VPNs blocked!</p>
              ) : (
                blocked.map((item, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded flex justify-between items-center hover:bg-gray-700 transition">
                    <span className="text-white font-medium">{item.tool}</span>
                    <span className="text-xs bg-red-500 px-2 py-1 rounded">BLOCKED</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Working VPNs */}
          <div className="bg-green-900/30 border-l-4 border-green-500 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              ✅ Working VPNs
              <span className="text-sm bg-green-500 px-2 py-1 rounded">{working.length}</span>
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {working.length === 0 ? (
                <p className="text-gray-400">⚠️ All VPNs appear blocked</p>
              ) : (
                working.map((item, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded flex justify-between items-center hover:bg-gray-700 transition">
                    <span className="text-white font-medium">{item.tool}</span>
                    <span className="text-xs bg-green-500 px-2 py-1 rounded">WORKING</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nym VPN Status */}
          <div className="bg-purple-900/30 border-l-4 border-purple-500 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-3">🔮 Nym VPN Status</h3>
            {nymStatus ? (
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Network Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        nymStatus.status === 'WORKING' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        nymStatus.status === 'WORKING' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {nymStatus.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex justify-between">
                  <span className="text-gray-300">Confidence Score</span>
                  <span className="text-white font-bold">{nymStatus.confidenceScore || 'N/A'}%</span>
                </div>
                <div className="bg-gray-800 p-3 rounded flex justify-between">
                  <span className="text-gray-300">Last Checked</span>
                  <span className="text-white text-sm">
                    {new Date(nymStatus.lastChecked).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Load data to see Nym VPN status</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
