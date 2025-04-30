// app/page.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Deal = {
  id: number
  title: string
  category: string
  current_points: number
  point_change: number
  last_updated: string
  is_hot: boolean
  description: string
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([])

  useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("last_updated", { ascending: false })

      if (error) {
        console.error("Error fetching deals:", error)
      } else {
        setDeals(data)
      }
    }

    fetchDeals()
  }, [])

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">最新の案件</h1>
      <ul className="space-y-4">
        {deals.map((deal) => (
          <li key={deal.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{deal.title}</h2>
            <p className="text-sm text-gray-600">{deal.category}</p>
            <p>{deal.description}</p>
            <p className="mt-2">
              <strong>ポイント:</strong> {deal.current_points}（変動: {deal.point_change}）
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}


// import { DealsList } from "@/components/deals-list"
// import { dealsData } from "@/lib/data"

// export default function Home() {
//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">ポイログ！</h1>
//       <DealsList deals={dealsData} />
//     </div>
//   )
// }
