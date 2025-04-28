import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import type { Deal } from "@/lib/types"
import { formatDate, formatPoints } from "@/lib/utils"

interface DealsListProps {
  deals: Deal[]
}

export function DealsList({ deals }: DealsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <Card key={deal.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{deal.title}</CardTitle>
              <Badge variant={deal.isHot ? "destructive" : "secondary"}>
                {formatPoints(deal.currentPoints)}ポイント
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground mb-4">{deal.category}</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>
                {deal.pointChange > 0 ? "+" : ""}
                {formatPoints(deal.pointChange)}ポイント （{formatDate(deal.lastUpdated)}）
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/deals/${deal.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                詳細を見る
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
