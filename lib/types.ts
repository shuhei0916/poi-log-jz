// app/lit/types.ts
export interface Deal {
  id: string
  title: string
  category: string
  description: string
  createdAt: string
  // currentPoints: number
}

export interface PriceHistory {
  date: string
  points: number
}
