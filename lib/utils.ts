// app/lib/types.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Deal } from "@/lib/types" 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPoints(points: number): string {
  if (typeof points !== "number") return "0";
  return points.toLocaleString("ja-JP")
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function convertToCamelCase(deal: any): Deal {
  return {
    id: deal.id,
    title: deal.title,
    category: deal.category,
    currentPoints: deal.current_points,
    pointChange: deal.point_change,
    lastUpdated: deal.last_updated,
    isHot: deal.is_hot,
    description: deal.description,
  }
}