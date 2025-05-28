// app/page.tsx
import { supabase } from "@/lib/supabase"
import { DealsList } from "@/components/deals-list"
import { Deal } from "@/lib/types" 
import { convertToCamelCase } from "@/lib/utils"

export default async function Home() {
  const { data: rawDeals, error } = await supabase
  .from("deals")
  .select("*")
//.order("created_at", { ascending: false }) 

  console.log("Raw deals data:", rawDeals)
  console.log("Supabase error:", error)
  const deals = rawDeals ?? []

  if (error) {
    console.error("Supabase error:", error.message)
    return <div>データの取得に失敗しました。</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ポイログ!</h1>
      <DealsList deals={deals as Deal[]} />
    </div>
  )
}