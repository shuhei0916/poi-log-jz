import { DealDetails } from "@/components/deal-details"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { convertToCamelCase } from "@/lib/utils"
import { Deal } from "@/lib/types"

export default async function DealPage({ params }: { params: { id: string } }) {
  // const dealData getDealFromSupabase(params.id)のように処理を関数化した方が良いかも
  const { data: dealData, error: dealError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!dealData || dealError) return notFound();
  const deal = convertToCamelCase(dealData);

  const { data: priceHistory, error: priceError } = await supabase
    .from("price_history")
    .select("*")
    .eq("deal_id", params.id)
    .order("date", { ascending: true });

  if (!priceHistory || priceError) {
    console.error("価格履歴の取得失敗", priceError);
  }

  return (
    <div className="container mx-auto py-8">
      <DealDetails deal={deal} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">価格推移</h2>
        <div className="bg-card p-4 rounded-lg border">
          <PriceHistoryChart priceHistory={priceHistory || []} />
        </div>
      </div>
    </div>
  );
}