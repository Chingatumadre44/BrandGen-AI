import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGeneric(modelName) {
    console.log(`\n--- Probando: ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Generate a minimal flat vector logo of a rocket, centered, white background, simple geometric style.";

        // Intentamos detectar si el modelo soporta generación de imágenes
        // Nota: En el SDK oficial, el método para Imagen 3 puede variar según la versión.
        // Si es un modelo Gemini estándar, usamos generateContent.

        console.log("⏳ Enviando prompt...");
        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log("✅ Respuesta recibida.");

        const candidate = response.candidates?.[0];
        if (!candidate) {
            console.log("⚠️ No hay candidatos en la respuesta.");
            return;
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart) {
            console.log("🎯 ¡IMAGEN GENERADA!");
            fs.writeFileSync(`test-${modelName.replace(/\//g, '-')}.png`, Buffer.from(imagePart.inlineData.data, 'base64'));
            console.log(`💾 Guardada como test-${modelName.replace(/\//g, '-')}.png`);
        } else {
            console.log("📝 El modelo devolvió solo texto:");
            console.log(response.text().substring(0, 100) + "...");
        }

    } catch (error) {
        console.log(`❌ Error con ${modelName}: ${error.message}`);
    }
}

async function start() {
    console.log("🚀 Iniciando prueba de fuego...");
    // Probamos primero los que suelen funcionar en AI Studio
    await testGeneric("models/gemini-1.5-flash");
    await testGeneric("models/gemini-1.5-pro");

    // Si tienes Imagen habilitado, estos podrían aparecer en check-models.js
    // El usuario debe revisar la lista de check-models.js antes.
    console.log("\n💡 REVISA LA SALIDA DE check-models.js");
    console.log("Si ves algún modelo llamado 'imagen-3.0...', cópialo y lo probaremos específicamente.");
}

start();
