import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import os
from datetime import datetime
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def get_point_from_hapitas(url: str) -> int | None:
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            tag = soup.find("strong", class_="calculated_detail_point")
            if tag:
                point_str = tag.get_text(strip=True).replace(",", "")
                return int(point_str)
    except Exception as e:
        print(f"❌ {url} でエラー: {e}")
    return None

def get_latest_points(source_id: str):
    result = supabase.table("price_history") \
        .select("points") \
        .eq("source_id", source_id) \
        .order("date", desc=True) \
        .limit(1) \
        .execute()
    if result.data:
        return result.data[0]["points"]
    return None

def update_scraping_sources(source_id: str, points: int):
    now = datetime.utcnow().isoformat()
    supabase.table("scraping_sources") \
        .update({
            "last_scraped_point": points,
            "last_scraped_at": now
        }) \
        .eq("id", source_id) \
        .execute()

def post_price_history(source_id: str, points: int):
    now = datetime.utcnow().isoformat()
    supabase.table("price_history").insert({
        "source_id": source_id,
        "points": points,
        "date": now
    }).execute()

# ----------------------------
# 🔁 全 scraping_sources を処理
# ----------------------------
print("🔍 scraping_sources から全案件を取得中...")
sources = supabase.table("scraping_sources").select("*").execute().data

for src in sources:
    source_id = src["id"]
    deal_id = src["deal_id"]
    url = src["url"]

    print(f"🌐 {url} をクロール中...")

    point = get_point_from_hapitas(url)
    if point is None:
        print("⚠️ ポイント情報の取得に失敗しました。\n")
        continue

    previous = get_latest_points(source_id)
    if previous == point:
        print(f"✅ 変化なし（{point}pt）→ スキップ。\n")
    else:
        print(f"📈 ポイント変動検出！{previous} → {point} pt")
        post_price_history(source_id, point)
        update_scraping_sources(source_id, point)
        print(f"✅ Supabase に保存完了。\n")
