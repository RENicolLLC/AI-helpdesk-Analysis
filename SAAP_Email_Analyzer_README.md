# SAAP_Email_Analyzer

**Version:** 0.1.0  
**Author:** Robert Nicol  
**Security Layer:** SAAP (Security AI Agent Protocol)

---

## 🧭 Project Purpose

A secure, AI-powered email analysis tool for helpdesk automation. Built with:

- SAAP for token/PIN validation, encrypted logging
- OpenAI for NLP (topic extraction, FAQ generation)
- Supabase (in Phase 2) for storing and retrieving results
- Cursor.dev for full local dev with integrated agent support

---

## 📁 Folder Structure

```
SAAP_Email_Analyzer/
├── .env.template              # API keys and config variables
├── analyze_emails.py          # GPT-4 logic for summarizing CSV email data
├── ingest_and_process.js      # SAAP-wrapped execution script
├── output/                    # Helpdesk results JSONs
├── saap/                      # CLI agent, logs, token validator, etc.
├── supabase/                  # Upload scripts & client config (Phase 2)
├── testdata/                  # CSV email exports for input
├── README.md                  # Project overview and setup
```

---

## 🚀 Getting Started

### 1. Setup Environment
Copy `.env.template` → `.env` and fill in:
```env
OPENAI_API_KEY=your-key
SUPABASE_URL=https://project.supabase.co
SUPABASE_KEY=your-secret-key
SAAP_TOKEN=your-dev-token
SAAP_PIN=1234
```

### 2. Drop a `.csv` file in `testdata/`

Use Gmail export or a sample.

### 3. Run Secure Analysis
```bash
saapanalyze
```

Output appears in `output/helpdesk_results.json`

---

## 🔐 SAAP Security Flow

- Token + PIN auth at runtime
- All actions logged with hash
- Log viewer and summarizer included (`sap.logs.js`, `summarizeLogs.js`)

---

## 🧠 LLM Prompt Template (used in analyze_emails.py)

```text
You are an AI support analyst. Extract the main topic, a likely FAQ, and suggest a helpdesk article title from the email below:

Email: {email_body}

Respond with a JSON object like:
{
  "topic": "...",
  "faq": "...",
  "article_title": "...",
  "summary": "..."
}
```

---

## 🪪 GitHub Setup

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: v0.1.0 with SAAP + GPT CSV analysis"
```

### Create Remote Repo
On GitHub:
- New repo: `SAAP_Email_Analyzer`
- No README or .gitignore (already included locally)

Then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/SAAP_Email_Analyzer.git
git push -u origin main
```

---

## 📈 Version Log

| Version | Date       | Notes                                     |
|---------|------------|-------------------------------------------|
| 0.1.0   | 2025-06-08 | Initial version with SAAP+OpenAI CSV flow |

---

## 💡 Cursor Prompt Template (for internal agent use)

```
Analyze support emails in testdata/support.csv.
Respect the folder structure. 
Use OpenAI for NLP. 
Keep logic modular. 
Output JSON to output/helpdesk_results.json. 
Wrap execution with SAAP token + PIN.
Avoid excessive boilerplate. Log every action.
```

---

Happy analyzing! 🛡️📬🧠
