"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Home, Star } from "lucide-react"
import { SearchForm } from "@/components/search-form"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <span>ポイログ！</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>ホーム</span>
              </Button>
            </Link>
            <Link href="/favorites">
              <Button variant="ghost" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>お気に入り</span>
              </Button>
            </Link>
          </nav>
          <SearchForm />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
