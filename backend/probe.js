import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI("test-key");

let output = "--- PROBE RESULTS ---\n";
output += `Type of genAI: ${typeof genAI}\n`;
output += `Methods on genAI instance: ${Object.getOwnPropertyNames(genAI).join(", ")}\n`;
output += `Methods on prototype: ${Object.getOwnPropertyNames(Object.getPrototypeOf(genAI)).join(", ")}\n`;

try {
    output += `Is listModels a function? ${typeof genAI.listModels}\n`;
} catch (e) {
    output += `Error checking listModels: ${e.message}\n`;
}

fs.writeFileSync("probe_results.txt", output);
console.log("Probe results saved to probe_results.txt");
