import { DealDetails } from "@/components/deal-details"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { dealsData, priceHistoryData } from "@/lib/data"
import { notFound } from "next/navigation"

export default function DealPage({ params }: { params: { id: string } }) {
  const dealId = params.id
  const deal = dealsData.find((deal) => deal.id === dealId)

  if (!deal) {
    return notFound()
  }

  const priceHistory = priceHistoryData[dealId] || []

  return (
    <div className="container mx-auto py-8">
      <DealDetails deal={deal} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">価格推移</h2>
        <div className="bg-card p-4 rounded-lg border">
          <PriceHistoryChart priceHistory={priceHistory} />
        </div>
      </div>
    </div>
  )
}
