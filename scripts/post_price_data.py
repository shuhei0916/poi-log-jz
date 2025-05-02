from supabase import create_client, Client
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # 書き込みにはservice role keyが必要

supabase: Client = create_client(url, key)
print(datetime.utcnow().isoformat())

# 追加したいデータ
new_data = {
    "deal_id": "deal1",
    "points": 8500,
    "date": datetime.utcnow().isoformat()
}

response = supabase.table("price_history").insert(new_data).execute()
print(response)
