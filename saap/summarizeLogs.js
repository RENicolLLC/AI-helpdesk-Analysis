import fs from "fs";
const log = fs.readFileSync("saap/sap.logs.js", "utf-8");
console.log("\n🔍 SAAP Log Summary:\n---------------------");
console.log(log);
