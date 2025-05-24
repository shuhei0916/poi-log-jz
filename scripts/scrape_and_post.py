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

# 対象の案件
deal_id = "deal1"
url = "https://hapitas.jp/item/detail/itemid/1594/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

# スクレイピングでポイント取得
response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")
    point_tag = soup.find("strong", class_="calculated_detail_point")

    if point_tag:
        point_value = point_tag.get_text(strip=True)
        point_value = int(point_value.replace(",", ""))
        print(f"現在の取得ポイント: {point_value} pt")

        # Supabaseから最新データを取得
        latest_query = (
            supabase
            .table("price_history")
            .select("points")
            .eq("deal_id", deal_id)
            .order("date", desc=True)
            .limit(1)
            .execute()
        )

        previous_points = None
        if latest_query.data:
            previous_points = latest_query.data[0]["points"]
            print(f"直近の記録ポイント: {previous_points} pt")

        if previous_points == point_value:
            print("ポイントに変化がないため、POSTをスキップします。")
        else:
            new_data = {
                "deal_id": deal_id,
                "points": point_value,
                "date": datetime.utcnow().isoformat()
                # "url": url  # urlカラム追加後に活用
            }
            response = supabase.table("price_history").insert(new_data).execute()
            print("変化を検知 → SupabaseにPOSTしました。")
            print(response)

    else:
        print("ポイント情報が見つかりませんでした。")
else:
    print(f"ページの取得に失敗しました（{response.status_code}）")
