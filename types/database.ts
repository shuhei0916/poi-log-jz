export interface Deal {
  id: string
  title: string
  category: string | null
  description: string | null
  created_at: string
}

export interface ScrapingSource {
  id: string
  deal_id: string
  source_id: string
  url: string
  last_scraped_point: number | null
  last_scraped_at: string | null
}

export interface PriceHistory {
  id: number
  source_id: string
  points: number
  date: string
}

export interface DealWithSources extends Deal {
  scraping_sources: ScrapingSource[]
  max_points: number
  min_points: number
  point_change: number
}
