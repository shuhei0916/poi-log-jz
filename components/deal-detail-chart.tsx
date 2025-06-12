"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { supabase } from "@/lib/supabase"
import type { PriceHistory, ScrapingSource } from "@/types/database"

interface DealDetailChartProps {
  dealId: string
}

interface ChartData {
  date: string
  dateTime: string
  [key: string]: string | number
}

export function DealDetailChart({ dealId }: DealDetailChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [sources, setSources] = useState<ScrapingSource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [dealId])

  const fetchChartData = async () => {
    try {
      // ソース情報を取得
      const { data: sourcesData, error: sourcesError } = await supabase
        .from("scraping_sources")
        .select("*")
        .eq("deal_id", dealId)

      if (sourcesError) throw sourcesError
      setSources(sourcesData || [])

      // 各ソースのポイント履歴を取得
      const sourceIds = sourcesData?.map((s) => s.id) || []
      if (sourceIds.length === 0) return

      const { data: historyData, error: historyError } = await supabase
        .from("price_history")
        .select("*")
        .in("source_id", sourceIds)
        .order("date", { ascending: true })

      if (historyError) throw historyError

      // チャート用データに変換
      const dataMap = new Map<string, any>()

      historyData?.forEach((history: PriceHistory) => {
        const dateObj = new Date(history.date)
        const date = dateObj.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })
        const dateTime = dateObj.toLocaleString("ja-JP")
        const source = sourcesData?.find((s) => s.id === history.source_id)

        if (!dataMap.has(date)) {
          dataMap.set(date, { date, dateTime })
        }

        if (source) {
          dataMap.get(date)[source.source_id] = history.points
        }
      })

      setChartData(Array.from(dataMap.values()))
    } catch (error) {
      console.error("Error fetching chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartConfig = sources.reduce((config, source, index) => {
    const colors = [
      "#3B82F6", // blue
      "#EF4444", // red
      "#10B981", // green
      "#F59E0B", // yellow
      "#8B5CF6", // purple
    ]
    config[source.source_id] = {
      label: source.source_id.charAt(0).toUpperCase() + source.source_id.slice(1),
      color: colors[index % colors.length],
    }
    return config
  }, {} as any)

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="h-6 bg-gray-800 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">ポイント変動履歴</CardTitle>
        <CardDescription className="text-gray-400">
          各ポイントサイトでのポイント数の推移（階段状グラフ）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${value.toLocaleString()}pt`}
                tick={{ fill: "#9CA3AF" }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                        <p className="text-gray-300 text-sm mb-2">{data.dateTime}</p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-white text-sm capitalize">{entry.dataKey}</span>
                            </div>
                            <span className="text-white font-medium">{entry.value?.toLocaleString()}pt</span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                wrapperStyle={{ color: "#9CA3AF" }}
                formatter={(value) => <span style={{ color: "#9CA3AF" }}>{chartConfig[value]?.label || value}</span>}
              />
              {sources.map((source, index) => (
                <Line
                  key={source.id}
                  type="stepAfter"
                  dataKey={source.source_id}
                  stroke={chartConfig[source.source_id]?.color}
                  strokeWidth={3}
                  dot={{
                    fill: chartConfig[source.source_id]?.color,
                    strokeWidth: 2,
                    r: 5,
                    stroke: "#1F2937",
                  }}
                  activeDot={{
                    r: 7,
                    stroke: chartConfig[source.source_id]?.color,
                    strokeWidth: 2,
                    fill: "#1F2937",
                  }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
