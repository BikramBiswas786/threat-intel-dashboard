"use client";

import { useState, useEffect } from "react";
import { TOOLS, COUNTRIES } from "./data/tools";

interface Threat {
  id: string;
  name: string;
  category: string;
  status: "working" | "blocked" | "intermittent" | "unknown";
  lastChecked: string;
  countries: string[];
  description: string;
  url: string;
}

export default function Home() {
  const [toolsData, setToolsData] = useState<Threat[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("IR");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
        const response = await fetch(`${baseUrl}/api/threats`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const threatsArray = Array.isArray(data) ? data : data.data || [];
        setToolsData(threatsArray.length > 0 ? threatsArray : TOOLS);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch threats:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        // Fallback to local TOOLS data
        setToolsData(TOOLS);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  const filteredTools = selectedTool
    ? toolsData.filter((t) => t.id === selectedTool)
    : toolsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text p-6">
      <header className="mb-12 p-4 text-center">
        <h1 className="mb-4 text-5xl font-bold text-white">🌐 Global Threat Intelligence</h1>
        <p className="text-gray-100 text-lg max-w-2xl mx-auto">
          Real-time censorship monitoring • 195 countries • 50 tools tracked
        </p>
      </header>

      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Warning</p>
          <p>{error} - Using cached data</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading threat intelligence...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Country Selector */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3">Select Country</h3>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Tool */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3">Filter Tools</h3>
                <button
                  onClick={() => setSelectedTool(null)}
                  className={`w-full p-2 rounded mb-2 text-left ${
                    selectedTool === null
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All Tools
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Working", color: "bg-green-500", count: toolsData.filter((t) => t.status === "working").length },
                { label: "Blocked", color: "bg-red-500", count: toolsData.filter((t) => t.status === "blocked").length },
                { label: "Intermittent", color: "bg-yellow-500", count: toolsData.filter((t) => t.status === "intermittent").length },
                { label: "Unknown", color: "bg-gray-500", count: toolsData.filter((t) => t.status === "unknown").length },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-4 rounded-lg shadow-lg">
                  <div className={`h-12 rounded-full mb-2 ${stat.color}`}></div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{tool.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        tool.status === "working"
                          ? "bg-green-500"
                          : tool.status === "blocked"
                            ? "bg-red-500"
                            : tool.status === "intermittent"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    >
                      {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    Last checked: {new Date(tool.lastChecked).toLocaleString()}
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Visit Tool
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}