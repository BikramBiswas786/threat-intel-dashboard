'use client';
import { useState } from 'react';
import { TOOLS, COUNTRIES } from '../data/tools';
export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('IR');
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Use local TOOLS data - no API calls
  const toolsData = TOOLS;
  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto text-center mb-12 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🛡️ Global Threat Intelligence
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time censorship monitoring • 195 countries • 50 tools tracked
        </p>
      </header>
      {/* Demo Warning Banner */}
      <div className="max-w-7xl mx-auto mb-8 p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-center font-semibold">
        ⚠️ <strong>PROTOTYPE - DEMO DATA ONLY</strong>
        <div className="text-sm mt-2 font-normal">
          This dashboard displays example data for demonstration purposes.
          <br/>
          <strong>NOT suitable for production use by activists.</strong> Real data infrastructure coming soon.
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Country Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Select Country</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {COUNTRIES.map(country => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`p-4 rounded-xl backdrop-blur-xl transition-all duration-300 border-2 ${
                  selectedCountry === country.code
                    ? 'bg-cyan-500/30 border-cyan-400 scale-105'
                    : 'bg-white/5 border-transparent hover:border-cyan-500/50 hover:scale-105'
                }`}
              >
                <div className="text-3xl mb-2">{country.flag}</div>
                <div className="font-semibold text-sm">{country.name}</div>
                <div className={`text-xs mt-1 ${
                  country.priority === 1 ? 'text-red-400' :
                  country.priority === 2 ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  Freedom: {country.freedom}%
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Tools Status in {currentCountry?.name || 'World'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map(tool => (
              <div
                key={tool.id}
                className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-cyan-500/20 hover:border-cyan-400 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-1">
                      {tool.name}
                    </h3>
                    <span className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  {tool.priority === 1 && (
                    <span className="text-2xl">⭐</span>
                  )}
                </div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold mb-4 ${
                  tool.metrics.status === 'working' ? 'bg-green-500/20 text-green-400' :
                  tool.metrics.status === 'slow' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tool.metrics.status === 'working' && '✅ Working'}
                  {tool.metrics.status === 'slow' && '⚠️ Slow'}
                  {tool.metrics.status === 'blocked' && '❌ Blocked'}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {tool.metrics.speed.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Mbps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {tool.metrics.confidence}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-orange-500/10 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Prediction</div>
                  <div className="text-sm text-orange-400">
                    ⚠️ {tool.metrics.daysUntilBlock} days until blocking
                  </div>
                </div>
                {tool.price && tool.price > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Price:</span>
                      <span className="text-cyan-400 font-bold">${tool.price}/month</span>
                    </div>
                    {tool.acceptsMonero && (
                      <button
                        onClick={() => {
                          setSelectedTool(tool.id);
                          setShowPaymentModal(true);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <span>💰</span>
                        Pay with Monero (XMR)
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showPaymentModal && selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27] p-8 rounded-2xl border-2 border-cyan-400 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-400">
                💰 Pay with Monero
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Tool:</p>
              <p className="text-xl font-bold text-cyan-400">
                {TOOLS.find(t => t.id === selectedTool)?.name}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Amount:</p>
              <p className="text-2xl font-bold text-orange-400">
                {TOOLS.find(t => t.id === selectedTool)?.price} USD in XMR
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Send Monero to:</p>
              <div className="bg-black/50 p-4 rounded-lg border border-cyan-500/30 break-all font-mono text-xs text-cyan-300">
                {TOOLS.find(t => t.id === selectedTool)?.moneroAddress}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(TOOLS.find(t => t.id === selectedTool)?.moneroAddress || '');
                  alert('✅ Address copied to clipboard!');
                }}
                className="mt-2 w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all"
              >
                📋 Copy Address
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="text-black text-center text-sm">
                [QR Code would appear here]
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              After payment, your access will be activated within 10 minutes.
              <br/>Transaction ID will be your proof of purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}