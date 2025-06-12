import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { DealDetailChart } from "@/components/deal-detail-chart"
import { supabase } from "@/lib/supabase"
import type { Deal, ScrapingSource } from "@/types/database"

interface DealPageProps {
  params: {
    id: string
  }
}

async function getDeal(id: string): Promise<{ deal: Deal; sources: ScrapingSource[] } | null> {
  const { data: deal, error: dealError } = await supabase.from("deals").select("*").eq("id", id).single()

  if (dealError || !deal) return null

  const { data: sources, error: sourcesError } = await supabase
    .from("scraping_sources")
    .select("*")
    .eq("deal_id", id)
    .order("last_scraped_point", { ascending: false })

  if (sourcesError) return null

  return { deal, sources: sources || [] }
}

export default async function DealPage({ params }: DealPageProps) {
  const result = await getDeal(params.id)

  if (!result) {
    notFound()
  }

  const { deal, sources } = result
  const maxPoints = sources.length > 0 ? Math.max(...sources.map((s) => s.last_scraped_point || 0)) : 0
  const bestSource = sources.find((s) => s.last_scraped_point === maxPoints)
  const totalSources = sources.length

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* ナビゲーション */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              ポイログ
            </Link>
            <span>/</span>
            <span className="text-white">{deal.title}</span>
          </nav>

          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>案件一覧に戻る</span>
            </Button>
          </Link>
        </div>

        {/* 案件詳細ヘッダー */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{deal.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {deal.category && (
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {deal.category}
                  </Badge>
                )}
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{new Date(deal.created_at).toLocaleDateString("ja-JP")} 登録</span>
                </div>
              </div>
              {deal.description && <p className="text-gray-400 text-lg max-w-2xl">{deal.description}</p>}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 min-w-[250px]">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">最高ポイント</div>
                <div className="text-3xl font-bold text-white mb-2">{maxPoints.toLocaleString()}pt</div>
                {bestSource && <div className="text-sm text-gray-400 mb-3">{bestSource.source_id} で獲得可能</div>}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{totalSources}サイト監視中</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* チャート */}
          <div className="lg:col-span-2">
            <DealDetailChart dealId={deal.id} />
          </div>

          {/* ポイントサイト一覧 */}
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">ポイントサイト別</CardTitle>
                <CardDescription className="text-gray-400">現在のポイント数（{totalSources}サイト）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sources.map((source, index) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full text-sm font-medium text-white">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white capitalize">{source.source_id}</div>
                        <div className="text-sm text-gray-400">
                          {source.last_scraped_at &&
                            `${new Date(source.last_scraped_at).toLocaleDateString("ja-JP")} 更新`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-white">
                        {source.last_scraped_point?.toLocaleString() || 0}pt
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
