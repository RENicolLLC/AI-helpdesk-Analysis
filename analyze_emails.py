import csv
import json
import os
import ast
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("❌ OPENAI_API_KEY is missing from .env")
    exit(1)

client = OpenAI()


def analyze_email(email_body):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI support analyst. Extract the main topic, a likely FAQ, "
                        "a helpdesk article title, and a short summary from the email below. "
                        "Respond with a JSON object like: "
                        "{ 'topic': '...', 'faq': '...', 'article_title': '...', 'summary': '...' }"
                    ),
                },
                {"role": "user", "content": email_body},
            ],
            temperature=0.7,
        )
        result = response.choices[0].message.content.strip()

        try:
            return json.loads(result)
        except json.JSONDecodeError:
            return ast.literal_eval(result)
    except Exception as e:
        print("❌ Error calling OpenAI API:", e)
        return None


def process_csv(file_path):
    results = []
    with open(file_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            email = row.get("body", "")
            print(f"🧠 Analyzing: {email[:60]}...")
            result = analyze_email(email)
            if result:
                print(
                    f"✅ Success: {result.get('topic')} – {result.get('article_title')}"
                )
                results.append(result)
            else:
                print("⚠️ Failed to analyze email.")
    return results


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python analyze_emails.py <csv_file>")
        exit(1)

    csv_file = sys.argv[1]
    output_path = "output/helpdesk_results.json"
    print(f"📥 Reading from {csv_file}")
    data = process_csv(csv_file)

    if data:
        os.makedirs("output", exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"✅ Analysis complete. Results saved to {output_path}")
    else:
        print("❌ No results to save.")
