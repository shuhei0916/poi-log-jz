"use client"

import type { PriceHistory } from "@/lib/types"
import { formatDate, formatPoints } from "@/lib/utils"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PriceHistoryChartProps {
  priceHistory: PriceHistory[]
}

export function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  const { theme } = useTheme()
  const [chartOptions, setChartOptions] = useState<ChartOptions<"line">>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const isDark = theme === "dark"
    const textColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: textColor,
            font: {
              weight: "bold",
            },
          },
        },
        tooltip: {
          backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
          titleColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          bodyColor: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => {
              return `${formatPoints(context.parsed.y)}ポイント`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
            callback: (value) => {
              return formatPoints(value as number)
            },
          },
          beginAtZero: true,
        },
      },
    })
  }, [theme, mounted])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>
  }

  const data = {
    labels: priceHistory.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "ポイント",
        data: priceHistory.map((item) => item.points),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0,
        stepped: true,
        fill: true,
      },
    ],
  }

  return (
    <div className="h-[400px]">
      <Line options={chartOptions} data={data} />
    </div>
  )
}
