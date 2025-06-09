import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_results(json_path="output/helpdesk_results.json"):
    with open(json_path, "r", encoding="utf-8") as f:
        results = json.load(f)
    for entry in results:
        # Insert each result as a row
        data = {
            "topic": entry.get("topic"),
            "faq": entry.get("faq"),
            "article_title": entry.get("article_title"),
            "summary": entry.get("summary"),
        }
        supabase.table("helpdesk_articles").insert(data).execute()
    print("Upload complete.")

if __name__ == "__main__":
    upload_results()
    