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

    let data = await response.json();

    // Filter by country if specified
    if (country && country !== 'ALL') {
      data = data.filter((item: any) => item.country === country);
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
