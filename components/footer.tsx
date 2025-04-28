export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ポイログ！</p>
        <p className="mt-1">このサイトはハピタスの公式サイトではありません。価格データは参考情報です。</p>
      </div>
    </footer>
  )
}
