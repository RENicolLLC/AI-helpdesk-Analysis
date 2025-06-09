import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.SAAP_TOKEN;
const pin = process.env.SAAP_PIN;
const csvFile = "testdata/support.csv";

console.log("🔐 Authenticating with SAAP...");
try {
  execSync(
    `node saap/cliAgentApp.js --token ${token} --pin ${pin} --exec "python3 analyze_emails.py ${csvFile}"`,
    { stdio: "inherit" }
  );

  console.log("📤 Uploading analysis results to Supabase...");
  execSync("node supabase/uploadResults.js", { stdio: "inherit" });

} catch (err) {
  console.error("❌ Error during execution:", err.message);
}
