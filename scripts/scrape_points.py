import requests
from bs4 import BeautifulSoup

url = "https://hapitas.jp/item/detail/itemid/1594/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")
    
    # 該当するクラスのstrongタグを探す
    point_tag = soup.find("strong", class_="calculated_detail_point")
    
    if point_tag:
        point_value = point_tag.get_text(strip=True)
        point_value = int(point_value.replace(",", ""))
        print(f"ポイント: {point_value} pt")
    else:
        print("ポイント情報が見つかりませんでした。")
else:
    print(f"ページの取得に失敗しました（{response.status_code}）")