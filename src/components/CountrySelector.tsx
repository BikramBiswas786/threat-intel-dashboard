import React from 'react';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

export function CountrySelector({ selectedCountry, onSelectCountry }: CountrySelectorProps) {
  const countries = ['Iran', 'China', 'Russia', 'Venezuela', 'Belarus'];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3 text-gray-800">Select Country</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => onSelectCountry(country)}
            className={`py-2 px-3 rounded-lg font-semibold transition-all ${
              selectedCountry === country
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}
