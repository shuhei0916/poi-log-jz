import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  // お気に入り機能は実装されていないため、サンプルとして表示
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ホームに戻る
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">お気に入り案件</h1>

      <div className="bg-card p-8 rounded-lg border text-center">
        <p className="text-muted-foreground mb-4">お気に入りに追加した案件がここに表示されます。</p>
        <p className="text-muted-foreground">
          案件詳細ページでスターアイコンをクリックして、お気に入りに追加できます。
        </p>
      </div>
    </div>
  )
}
