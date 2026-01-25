import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const APIFY_DATASETS = [
  process.env.APIFY_DATASET_1 || 'eL63AeN6s48w5ouhH',
  process.env.APIFY_DATASET_2 || 'nR83y4bcqrE1y3lC3Jt'
];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchFromApify(datasetId: string) {
  if (!datasetId) return [];
  
  try {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Apify API returned ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching from Apify dataset ${datasetId}:`, error.message);
    return [];
  }
}

function transformData(rawData: any[]) {
  return rawData.map(item => ({
    country: item.country || 'Unknown',
    tool_id: item.toolId || 'unknown',
    tool_name: item.toolName || 'Unknown',
    category: item.category || null,
    blocked: item.blocked === true,
    confidence: item.confidence || 0,
    methods: item.methods || [],
    sources: item.sources || [],
    recommendation: item.recommendation || '',
    last_updated: item.lastUpdated || new Date().toISOString(),
    nym_alternative: item.nymAlternative || null
  }));
}

async function syncToSupabase(data: any[]) {
  try {
    const { error } = await supabase
      .from('threats')
      .upsert(data, { 
        onConflict: 'tool_id,country',
        ignoreDuplicates: false 
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Supabase sync error:', error.message);
    throw error;
  }
}

export async function POST() {
  try {
    const allData: any[] = [];
    
    for (const datasetId of APIFY_DATASETS) {
      const data = await fetchFromApify(datasetId);
      allData.push(...data);
    }
    
    if (allData.length === 0) {
      return NextResponse.json(
        { error: 'No data fetched from Apify' },
        { status: 404 }
      );
    }
    
    const transformedData = transformData(allData);
    await syncToSupabase(transformedData);
    
    return NextResponse.json({
      success: true,
      synced: transformedData.length,
      message: `Successfully synced ${transformedData.length} records`
    });
  } catch (error: any) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
