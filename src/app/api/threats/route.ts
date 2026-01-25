import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'ALL';

    let query = supabase
      .from('threats')
      .select('*')
      .order('last_updated', { ascending: false });

    // Filter by country if specified
    if (country && country !== 'ALL') {
      query = query.eq('country', country);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return Response.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Failed to fetch threats data' },
      { status: 500 }
    );
  }
}
