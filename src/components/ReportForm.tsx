import React, { useState } from 'react';

interface ReportFormProps {
  onSubmit: (report: { tool: string; status: string; speed: number; country: string }) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [tool, setTool] = useState('');
  const [status, setStatus] = useState('');
  const [speed, setSpeed] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tool && status && speed) {
      onSubmit({
        tool,
        status,
        speed: parseFloat(speed),
        country: 'User Report',
      });
      setTool('');
      setStatus('');
      setSpeed('');
      alert('✅ Report submitted successfully!');
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Submit Threat Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tool Name</label>
          <input
            type="text"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            placeholder="e.g., Tor, VPN, Proxy"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select Status</option>
            <option value="Working">Working</option>
            <option value="Blocked">Blocked</option>
            <option value="Slow">Slow</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Speed (Mbps)</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            placeholder="e.g., 5.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            step="0.1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          📤 Submit Report
        </button>
      </form>
    </div>
  );
}
