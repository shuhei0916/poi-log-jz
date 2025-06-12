"use client"

import { useState, useEffect } from "react"
import { DealCard } from "./deal-card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { DealWithSources } from "@/types/database"

type SortType = "hot" | "new"

export function DealsList() {
  const [deals, setDeals] = useState<DealWithSources[]>([])
  const [loading, setLoading] = useState(true)
  const [sortType, setSortType] = useState<SortType>("hot")

  useEffect(() => {
    fetchDeals()
  }, [sortType])

  const fetchDeals = async () => {
    setLoading(true)
    try {
      const { data: dealsData, error } = await supabase
        .from("deals")
        .select(`
          *,
          scraping_sources (*)
        `)
        .order(sortType === "new" ? "created_at" : "title", { ascending: false })

      if (error) throw error

      const dealsWithStats =
        dealsData?.map((deal) => {
          const sources = deal.scraping_sources || []
          const points = sources.map((s) => s.last_scraped_point || 0).filter((p) => p > 0)
          const maxPoints = points.length > 0 ? Math.max(...points) : 0
          const minPoints = points.length > 0 ? Math.min(...points) : 0

          return {
            ...deal,
            max_points: maxPoints,
            min_points: minPoints,
            point_change: Math.floor(Math.random() * 2000 - 500), // 仮の変動値
          }
        }) || []

      // ホット順の場合はポイント変動でソート
      if (sortType === "hot") {
        dealsWithStats.sort((a, b) => b.point_change - a.point_change)
      }

      setDeals(dealsWithStats)
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant={sortType === "hot" ? "default" : "outline"}
            onClick={() => setSortType("hot")}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>ホット</span>
          </Button>
          <Button
            variant={sortType === "new" ? "default" : "outline"}
            onClick={() => setSortType("new")}
            className="flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>新着</span>
          </Button>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>フィルター</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
