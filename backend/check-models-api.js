import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GEMINI_API_KEY;

async function checkModels() {
    console.log("--- AUDITORÍA DIRECTA DE API ---");
    if (!API_KEY) {
        console.error("X Error: No se encontró API key en .env");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("X ERROR DE API:", data.error.message);
            return;
        }

        console.log("✓ LISTA DE MODELOS (Detallada):");
        data.models.filter(m => m.name.includes("imagen") || m.name.includes("gemini-1.5")).forEach(m => {
            console.log(`- ${m.name}`);
            console.log(`  DisplayName: ${m.displayName}`);
            console.log(`  Métodos: ${m.supportedGenerationMethods.join(", ")}`);
        });


    } catch (error) {
        console.error("X ERROR CRÍTICO:", error.message);
    }
}

checkModels();
