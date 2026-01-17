// src/app/api/reports/latest/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get('country') || 'IR';

  try {
    // Demo data for now - this will be replaced with real Apify data
    const DEMO_DATA = {
      IR: [
        {
          id: 1,
          name: "Tor Browser",
          category: "Anonymity",
          priority: 1,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "working",
            speed: 3.2,
            confidence: 98,
            daysUntilBlock: 138
          }
        },
        {
          id: 2,
          name: "NYM VPN",
          category: "Mixnet",
          priority: 2,
          price: 10,
          acceptsMonero: true,
          moneroAddress: "8AVXjbgL4prG2iXJ8LvHHxEo3bwKXcJuHLXWmEKt3Q8T9yHuUQPjLPLU3kVfU4Ygzs5TM7DLb6BqKzH8h6d6X7VzxKUkG9",
          metrics: {
            status: "slow",
            speed: 4.3,
            confidence: 70,
            daysUntilBlock: 203
          }
        },
        {
          id: 3,
          name: "Mullvad VPN",
          category: "Commercial",
          priority: 0,
          price: 5,
          acceptsMonero: true,
          moneroAddress: "84pXLqJMzDUEYd4bMgSuQnYC9m2vSBxMcccNy2D9jVgj9dVxB9fL7B7gJdqK9h8m9N8R5Q9x5A9u9K7c",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 84,
            daysUntilBlock: 152
          }
        },
        {
          id: 4,
          name: "ProtonVPN",
          category: "Commercial",
          priority: 0,
          price: 10,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "slow",
            speed: 9.3,
            confidence: 94,
            daysUntilBlock: 151
          }
        },
        {
          id: 5,
          name: "ExpressVPN",
          category: "Commercial",
          priority: 0,
          price: 12,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "working",
            speed: 4.5,
            confidence: 81,
            daysUntilBlock: 164
          }
        },
        {
          id: 6,
          name: "NordVPN",
          category: "Commercial",
          priority: 0,
          price: 11,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 75,
            daysUntilBlock: 62
          }
        },
        {
          id: 7,
          name: "Surfshark",
          category: "Commercial",
          priority: 0,
          price: 9,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "slow",
            speed: 10.3,
            confidence: 82,
            daysUntilBlock: 97
          }
        },
        {
          id: 8,
          name: "IVPN",
          category: "Commercial",
          priority: 0,
          price: 10,
          acceptsMonero: true,
          moneroAddress: "84pXLqJMzDUEYd4bMgSuQnYC9m2vSBxMcccNy2D9jVgj9dVxB9fL7B7gJdqK9h8m9N8R5Q9x5A9u9K7c",
          metrics: {
            status: "slow",
            speed: 10.4,
            confidence: 62,
            daysUntilBlock: 21
          }
        },
        {
          id: 9,
          name: "Private Internet Access",
          category: "Commercial",
          priority: 0,
          price: 7,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "slow",
            speed: 7.1,
            confidence: 76,
            daysUntilBlock: 52
          }
        },
        {
          id: 10,
          name: "Windscribe",
          category: "Commercial",
          priority: 0,
          price: 9,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "slow",
            speed: 5.3,
            confidence: 73,
            daysUntilBlock: 184
          }
        },
        {
          id: 11,
          name: "Signal",
          category: "Messaging",
          priority: 1,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 67,
            daysUntilBlock: 128
          }
        },
        {
          id: 12,
          name: "Psiphon",
          category: "Circumvention",
          priority: 0,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 91,
            daysUntilBlock: 29
          }
        }
      ],
      CN: [
        {
          id: 1,
          name: "Tor Browser",
          category: "Anonymity",
          priority: 1,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 95,
            daysUntilBlock: 0
          }
        },
        {
          id: 2,
          name: "NYM VPN",
          category: "Mixnet",
          priority: 2,
          price: 10,
          acceptsMonero: true,
          moneroAddress: "8AVXjbgL4prG2iXJ8LvHHxEo3bwKXcJuHLXWmEKt3Q8T9yHuUQPjLPLU3kVfU4Ygzs5TM7DLb6BqKzH8h6d6X7VzxKUkG9",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 88,
            daysUntilBlock: 0
          }
        },
        {
          id: 11,
          name: "Signal",
          category: "Messaging",
          priority: 1,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "blocked",
            speed: 0,
            confidence: 97,
            daysUntilBlock: 0
          }
        }
      ],
      RU: [
        {
          id: 1,
          name: "Tor Browser",
          category: "Anonymity",
          priority: 1,
          price: 0,
          acceptsMonero: false,
          moneroAddress: "",
          metrics: {
            status: "working",
            speed: 2.9,
            confidence: 96,
            daysUntilBlock: 180
          }
        },
        {
          id: 2,
          name: "Mullvad VPN",
          category: "Commercial",
          priority: 0,
          price: 5,
          acceptsMonero: true,
          moneroAddress: "84pXLqJMzDUEYd4bMgSuQnYC9m2vSBxMcccNy2D9jVgj9dVxB9fL7B7gJdqK9h8m9N8R5Q9x5A9u9K7c",
          metrics: {
            status: "slow",
            speed: 2.3,
            confidence: 85,
            daysUntilBlock: 120
          }
        }
      ]
    };

    const countryData = DEMO_DATA[country as keyof typeof DEMO_DATA] || DEMO_DATA.IR;

    return NextResponse.json(countryData);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}