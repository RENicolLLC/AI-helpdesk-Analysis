#!/bin/bash

# Full Health Check Script for AI_Helpdesk_Analysis
# Save as: ./scripts/check_sdk_health.sh

set -e

echo "\U0001F50D Running Full Environment Health Check..."

# --------------------------------------------
# 1. .env File Check
# --------------------------------------------
echo -e "\n\U0001F4E6 Checking .env variables..."
ENV_FILE=".env"
REQUIRED_VARS=("OPENAI_API_KEY" "SUPABASE_URL" "SUPABASE_KEY" "SUPABASE_TABLE" "SAAP_TOKEN" "SAAP_PIN")
for VAR in "${REQUIRED_VARS[@]}"; do
  if grep -q "^$VAR=" "$ENV_FILE"; then
    echo "✅ $VAR found in .env"
  else
    echo "❌ $VAR MISSING in .env"
  fi
done

# --------------------------------------------
# 2. OpenAI SDK Usage Check
# --------------------------------------------
echo -e "\n\U0001F9E0 Checking OpenAI SDK usage..."
if grep -qr "from openai import OpenAI" . --include="*.py"; then
  echo "✅ Found correct new SDK usage: 'from openai import OpenAI'"
else
  echo "❌ SDK import missing or using legacy format"
fi

if grep -qr "client.chat.completions.create" . --include="*.py"; then
  echo "✅ New style completions call found."
else
  echo "⚠️ Missing completions.create call"
fi

# --------------------------------------------
# 3. Python Linting & Formatting
# --------------------------------------------
echo -e "\n\U0001F40D Validating Python syntax..."
python3 -m py_compile analyze_emails.py && echo "✅ Python syntax OK"

echo "\U0001F9FD Running code formatter (black)..."
black --check analyze_emails.py || echo "⚠️ Consider running 'black analyze_emails.py' to format code"

# --------------------------------------------
# 4. Check for Output File
# --------------------------------------------
echo -e "\n\U0001F5C3️ Checking JSON output file..."
if [[ -f "output/helpdesk_results.json" ]]; then
  echo "✅ output/helpdesk_results.json exists."
else
  echo "⚠️ output/helpdesk_results.json not found. Will be created on next run."
fi

# --------------------------------------------
# 5. File Structure Verification
# --------------------------------------------
echo -e "\n\U0001F4C1 Verifying expected file structure..."
REQUIRED_FILES=(
  "ingest_and_process.js"
  "analyze_emails.py"
  "saap/cliAgentApp.js"
  "testdata/support.csv"
  ".env"
)

for FILE in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$FILE" || -d "$FILE" ]]; then
    echo "✅ Found $FILE"
  else
    echo "❌ Missing $FILE"
  fi
done

echo -e "\n\U00002705 Health check complete!"
