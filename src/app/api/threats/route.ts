// Country code mapping helper
const COUNTRY_CODES: { [key: string]: string } = {
  'AF': 'Afghanistan', 'CN': 'China', 'RU': 'Russia', 'IR': 'Iran',
  'TR': 'Turkey', 'AE': 'UAE', 'IN': 'India', 'US': 'United States',
  'GB': 'United Kingdom', 'SY': 'Syria', 'CU': 'Cuba', 'VN': 'Vietnam',
  'TH': 'Thailand', 'SA': 'Saudi Arabia', 'KP': 'North Korea'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'ALL';

    // Fetch data from Apify API
    const apifyUrl = `https://api.apify.com/v2/datasets/eL63AeN6s48w5ouhH/items?token=${process.env.APIFY_API_TOKEN}`;
    const response = await fetch(apifyUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Apify API returned ${response.status}`);
    }

    let rawData = await response.json();

    // Transform Apify data structure to frontend expected format
    const transformedData = rawData.map((item: any) => ({
      tool: item.toolName || 'Unknown',
      country: COUNTRY_CODES[item.country] || item.country,
      countryCode: item.country,
      status: item.blocked === true ? 'BLOCKED' : item.blocked === false ? 'WORKING' : 'ANOMALY',
      confidenceScore: item.confidence || 0,
      method2: item.methods?.[0] || 'UNKNOWN',
      source: item.sources?.[0] || 'Unknown',
      lastChecked: item.lastUpdated || new Date().toISOString(),
      recommendation2: item.recommendation || ''
    }));

    // Filter by country if specified
    let data = transformedData;
    if (country && country !== 'ALL') {
      data = transformedData.filter((item: any) => item.countryCode === country);
    }

    return Response.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return Response.json(
      { error: 'Failed to fetch threats data' },
      { status: 500 }
    );
  }
}
