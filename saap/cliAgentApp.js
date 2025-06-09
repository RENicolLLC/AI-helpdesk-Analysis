import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
let token, pin, execCmd;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--token") token = args[i + 1];
  if (args[i] === "--pin") pin = args[i + 1];
  if (args[i] === "--exec") execCmd = args[i + 1];
}

if (!token || !pin || !execCmd) {
  console.error("Usage: node cliAgentApp.js --token <token> --pin <pin> --exec <command>");
  process.exit(1);
}

console.log("🔐 SAAP verification...");
if (token === "your-test-token" && pin === "1234") {
  console.log("✅ Token and PIN validated");
  try {
    execSync(execCmd, { stdio: "inherit" });
    fs.appendFileSync("saap/sap.logs.js", `PASS: ${new Date().toISOString()} | ${execCmd}\n`);
  } catch (err) {
    console.error("❌ Command failed:", err.message);
    fs.appendFileSync("saap/sap.logs.js", `FAIL: ${new Date().toISOString()} | ${execCmd} | ${err.message}\n`);
    process.exit(1);
  }
} else {
  console.error("❌ Invalid token or PIN");
  fs.appendFileSync("saap/sap.logs.js", `REJECTED: ${new Date().toISOString()} | Invalid token or PIN\n`);
  process.exit(1);
}
