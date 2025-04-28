"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchForm() {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 検索処理を実装
    console.log("検索クエリ:", query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full max-w-md gap-2">
        <Input
          type="text"
          placeholder="案件名、カテゴリーなどで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Search className="h-4 w-4 mr-2" />
          検索
        </Button>
      </div>
    </form>
  )
}
