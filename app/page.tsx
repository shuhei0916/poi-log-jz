import { DealsList } from "@/components/deals-list"
import { dealsData } from "@/lib/data"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ポイログ！</h1>
      <DealsList deals={dealsData} />
    </div>
  )
}
