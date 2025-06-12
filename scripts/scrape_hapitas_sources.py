import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from datetime import datetime
import uuid
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

# Supabase接続設定
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Supabase URLとKEYが必要です。環境変数を設定してください。")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# スクレイピング対象URL（カテゴリ: クレジットカード）
BASE_URL = "https://hapitas.jp"
LIST_URL = f"{BASE_URL}/category/service_credit/apn/header_category/"

# BeautifulSoupでHTMLを取得
response = requests.get(LIST_URL)
soup = BeautifulSoup(response.text, "html.parser")

# 案件の情報を含むHTML要素を取得
cards = soup.select("div.item_slots_thumb")  # 必要に応じてCSSセレクタ調整

for card in cards:
    # タイトル取得
    title_tag = card.select_one("div.thumb_slots_title > p.store")
    if not title_tag:
        continue
    title = title_tag.text.strip()

    # ポイント数取得
    point_tag = card.select_one("p.caption")
    if point_tag:
        point_str = point_tag.text.strip().replace(",", "").replace("pt", "").replace("Ｐ", "")
        try:
            point = int(point_str)
        except ValueError:
            point = None
    else:
        point = None

    # 詳細ページURL取得
    url_tag = card.select_one("a.thumb_slots_link")
    if not url_tag or not url_tag.get("href"):
        continue

    relative_url = url_tag["href"]
    detail_url = relative_url if relative_url.startswith("http") else BASE_URL + relative_url


    # dealの存在確認
    existing_deals = supabase.table("deals").select("id").eq("title", title).execute()
    if existing_deals.data:
        deal_id = existing_deals.data[0]["id"]
    else:
        # 新しいdealを作成
        deal_id = str(uuid.uuid4())
        supabase.table("deals").insert({
            "id": deal_id,
            "title": title,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        print(f"✅ Added new deal: {title}")

    # scraping_sourceの重複確認
    existing_sources = supabase.table("scraping_sources").select("id").eq("url", detail_url).execute()
    if existing_sources.data:
        print(f"⚠️ Already exists: {detail_url}")
        continue

    # scraping_sourcesへの追加
    source_id = str(uuid.uuid4())
    supabase.table("scraping_sources").insert({
        "id": source_id,
        "deal_id": deal_id,
        "source_id": "hapitas",
        "url": detail_url,
        "last_scraped_point": point,
        "last_scraped_at": datetime.utcnow().isoformat()
    }).execute()
    print(f"✅ Added new source for {title}: {detail_url}")
