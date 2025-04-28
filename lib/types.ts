export interface Deal {
  id: string
  title: string
  category: string
  currentPoints: number
  pointChange: number
  lastUpdated: string
  isHot: boolean
  description: string
}

export interface PriceHistory {
  date: string
  points: number
}
