import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const csvFile = process.argv[2];
if (!csvFile) {
  console.error("Usage: node ingest_and_process.js <csv_file>");
  process.exit(1);
}

const token = process.env.SAAP_TOKEN;
const pin = process.env.SAAP_PIN;

console.log("Authenticating with SAAP...");
try {
  execSync(
    `node saap/cliAgentApp.js --token ${token} --pin ${pin} --exec "python3 analyze_emails.py ${csvFile}"`,
    {
      stdio: "inherit",
      env: {
        ...process.env, // ✅ Pass all environment vars into child process!
      },
    }
  );
} catch (err) {
  console.error("SAAP validation or analysis failed.");
  process.exit(1);
}
