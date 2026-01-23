export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'ALL';
    
    const backendUrl = 'https://threat-dashboard-backend.vercel.app';
    const response = await fetch(`${backendUrl}/api/threats?country=${country}`);
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return Response.json(
      { error: 'Failed to fetch threats data' },
      { status: 500 }
    );
  }
}
