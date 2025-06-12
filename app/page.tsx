import { DealsList } from "@/components/deals-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ポイログ</h1>
          <p className="text-gray-400 text-lg">ポイントサイトの案件を横断的に比較・分析するダッシュボード</p>
        </div>

        {/* 統計カード */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">総案件数</CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">5</div>
              <p className="text-xs text-gray-500">アクティブな案件</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">監視サイト数</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-gray-500">Hapitas, Moppy, ECナビ</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">今日の更新</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7</div>
              <p className="text-xs text-gray-500">ポイント変動あり</p>
            </CardContent>
          </Card>
        </div>

        {/* 案件一覧 */}
        <DealsList />
      </div>
    </div>
  )
}
