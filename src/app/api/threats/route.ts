import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const country = url.searchParams.get('country') || 'ALL';
    const pageSize = 1000;
    
    const start = page * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('threats')
      .select('*', { count: 'exact' })
      .order('last_updated', { ascending: false });

    // Filter by country if specified
    if (country && country !== 'ALL') {
      query = query.eq('country', country);
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return Response.json({
      data: data || [],
      page,
      pageSize,
      total: count || 0,
      hasMore: (start + pageSize) < (count || 0)
    });
  } catch (err) {
    console.error('API error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch threats' },
      { status: 500 }
    );
  }
}
