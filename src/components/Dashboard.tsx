"use client";
import React, { useState, useEffect } from "react";
import { ThreatCard } from "./ThreatCard";
import { CountrySelector } from "./CountrySelector";
import { ReportForm } from "./ReportForm";
interface Threat {
  id: string;
  country: string;
  tool: string;
  status: string;
  speed: number;
  timestamp: string;
}
export function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState("Iran");
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(false);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/threats?country=${selectedCountry}`
        );
        const data = await response.json();
        setThreats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching threats:", error);
        setThreats([]);
      }
      setLoading(false);
    };
    fetchThreats();
  }, [selectedCountry, backendUrl]);
  const handleReportSubmit = async (report: any) => {
    try {
      const response = await fetch(`${backendUrl}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          tool: report.tool,
          status: report.status,
          speed: report.speed,
        }),
      });
      if (response.ok) {
        const newThreats = await fetch(
          `${backendUrl}/api/threats?country=${selectedCountry}`
        ).then((r) => r.json());
        setThreats(Array.isArray(newThreats) ? newThreats : []);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🔍 Threat Intelligence Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time monitoring of government censorship worldwide
          </p>
        </div>
        <div className="text-gray-800">
          <CountrySelector
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            📊 Active Threats - {selectedCountry}
          </h2>
          {loading ? (
            <p className="text-gray-400">⏳ Loading threats...</p>
          ) : threats.length > 0 ? (
            <div>
              {threats.map((threat) => (
                <div key={threat.id} className="text-gray-800">
                  <ThreatCard threat={threat} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No threats detected for {selectedCountry}
            </p>
          )}
        </div>
        <div className="text-gray-800">
          <ReportForm onSubmit={handleReportSubmit} />
        </div>
      </div>
    </div>
  );
}
