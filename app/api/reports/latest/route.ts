import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "IR";
    const { data, error } = await supabase
      .from("status_reports")
      .select("*")
      .eq("country_code", country)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}