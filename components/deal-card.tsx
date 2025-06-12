import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { DealWithSources } from "@/types/database"

interface DealCardProps {
  deal: DealWithSources
}

export function DealCard({ deal }: DealCardProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-gray-500"
  }

  return (
    <Link href={`/deals/${deal.id}`} className="block">
      <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-200 bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg text-white hover:text-blue-400 transition-colors">{deal.title}</CardTitle>
              {deal.category && (
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {deal.category}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(deal.point_change)}
              <span className={`text-sm font-medium ${getTrendColor(deal.point_change)}`}>
                {deal.point_change > 0 ? "+" : ""}
                {deal.point_change}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">最高ポイント</span>
              <span className="text-xl font-bold text-white">{deal.max_points?.toLocaleString()}pt</span>
            </div>

            <div className="space-y-2">
              {deal.scraping_sources.slice(0, 3).map((source) => (
                <div key={source.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 capitalize">{source.source_id}</span>
                    <ExternalLink className="h-3 w-3 text-gray-500" />
                  </div>
                  <span className="text-white font-medium">{source.last_scraped_point?.toLocaleString()}pt</span>
                </div>
              ))}
              {deal.scraping_sources.length > 3 && (
                <div className="text-xs text-gray-500 text-center">+{deal.scraping_sources.length - 3}件のサイト</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
