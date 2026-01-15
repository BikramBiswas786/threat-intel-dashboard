import React from 'react';

interface Threat {
  id: string;
  country: string;
  tool: string;
  status: string;
  speed: number;
  timestamp: string;
}

interface ThreatCardProps {
  threat: Threat;
}

export function ThreatCard({ threat }: ThreatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{threat.tool}</h3>
          <p className="text-sm text-gray-600">Country: {threat.country}</p>
          <p className="text-sm text-gray-600">Status: <span className="text-red-600 font-bold">{threat.status}</span></p>
          <p className="text-sm text-gray-600">Speed: {threat.speed} Mbps</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{new Date(threat.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
