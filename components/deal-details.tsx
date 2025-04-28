import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Deal } from "@/lib/types"
import { formatDate, formatPoints } from "@/lib/utils"
import { ArrowLeft, ExternalLink, Star } from "lucide-react"
import Link from "next/link"

interface DealDetailsProps {
  deal: Deal
}

export function DealDetails({ deal }: DealDetailsProps) {
  return (
    <div>
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle className="text-2xl">{deal.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={deal.isHot ? "destructive" : "secondary"} className="text-base px-3 py-1">
                {formatPoints(deal.currentPoints)}ポイント
              </Badge>
              <Button size="icon" variant="outline">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">案件情報</h3>
              <dl className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <dt className="text-muted-foreground">カテゴリー</dt>
                <dd>{deal.category}</dd>
                <dt className="text-muted-foreground">最終更新</dt>
                <dd>{formatDate(deal.lastUpdated)}</dd>
                <dt className="text-muted-foreground">ポイント変動</dt>
                <dd className={deal.pointChange > 0 ? "text-green-500" : deal.pointChange < 0 ? "text-red-500" : ""}>
                  {deal.pointChange > 0 ? "+" : ""}
                  {formatPoints(deal.pointChange)}ポイント
                </dd>
              </dl>
            </div>
            <div>
              <h3 className="font-medium mb-2">案件詳細</h3>
              <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
              <Button className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                ハピタスで確認する
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
