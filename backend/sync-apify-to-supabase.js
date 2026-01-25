require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Apify Actor Dataset IDs (Both actors)
const APIFY_DATASETS = [
  process.env.APIFY_DATASET_1 || 'eL63AeN6s48w5ouhH', // Main VPN data
  process.env.APIFY_DATASET_2 || '' // Second actor dataset
];

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Country code mapping
const COUNTRY_CODES = {
  'AF': 'Afghanistan', 'CN': 'China', 'RU': 'Russia', 'IR': 'Iran',
  'TR': 'Turkey', 'AE': 'UAE', 'IN': 'India', 'US': 'United States',
  'GB': 'United Kingdom', 'SY': 'Syria', 'CU': 'Cuba', 'VN': 'Vietnam',
  'TH': 'Thailand', 'SA': 'Saudi Arabia', 'KP': 'North Korea'
};

async function fetchFromApify(datasetId) {
  if (!datasetId) return [];
  
  try {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`;
    console.log(`📥 Fetching from Apify dataset: ${datasetId}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Apify API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} records from dataset ${datasetId}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching from Apify dataset ${datasetId}:`, error.message);
    return [];
  }
}

function transformData(rawData) {
  return rawData.map(item => ({
    tool: item.toolName || item.tool || 'Unknown',
    country: COUNTRY_CODES[item.country] || item.country,
    country_code: item.country || item.countryCode,
    status: item.blocked === true ? 'BLOCKED' : item.blocked === false ? 'WORKING' : 'ANOMALY',
    confidence_score: item.confidence || item.confidenceScore || 0,
    method: item.methods?.[0] || item.method2 || 'UNKNOWN',
    source: item.sources?.[0] || item.source || 'Unknown',
    last_updated: item.lastUpdated || item.lastChecked || new Date().toISOString(),
    recommendation: item.recommendation || item.recommendation2 || ''
  }));
}

async function syncToSupabase(data) {
  console.log(`💾 Syncing ${data.length} records to Supabase...`);
  
  try {
    // Upsert data (insert or update)
    const { data: result, error } = await supabase
      .from('vpn_threats')
      .upsert(data, { 
        onConflict: 'tool,country_code',
        ignoreDuplicates: false 
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully synced to Supabase`);
    return result;
  } catch (error) {
    console.error(`❌ Supabase sync error:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Apify → Supabase sync pipeline...');
  console.log(`📊 Datasets to sync: ${APIFY_DATASETS.filter(d => d).length}`);
  
  try {
    // Fetch from all Apify datasets
    const allData = [];
    for (const datasetId of APIFY_DATASETS) {
      const data = await fetchFromApify(datasetId);
      allData.push(...data);
    }
    
    console.log(`📦 Total records fetched: ${allData.length}`);
    
    if (allData.length === 0) {
      console.log('⚠️  No data to sync');
      return;
    }
    
    // Transform data to match Supabase schema
    const transformedData = transformData(allData);
    console.log(`🔄 Transformed ${transformedData.length} records`);
    
    // Sync to Supabase
    await syncToSupabase(transformedData);
    
    console.log('✅ Pipeline completed successfully!');
    console.log(`📊 Stats: ${transformedData.length} records synced`);
  } catch (error) {
    console.error('❌ Pipeline failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, fetchFromApify, transformData, syncToSupabase };
