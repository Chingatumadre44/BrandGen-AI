import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GEMINI_API_KEY;

async function check() {
    if (!API_KEY) {
        console.log("❌ No se encontró API_KEY en el .env");
        return;
    }

    console.log("--- 🕵️ AUDITORÍA DE MODELOS (SDK OFICIAL) ---");
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        const result = await genAI.listModels();

        if (!result.models || result.models.length === 0) {
            console.log("⚠️ La respuesta no contiene modelos o está vacía.");
            console.dir(result, { depth: null });
            return;
        }

        console.log(`✅ Se encontraron ${result.models.length} modelos:`);

        result.models.forEach(m => {
            const isImage = m.name.includes("imagen") || m.supportedGenerationMethods.includes("generateImages");
            const icon = isImage ? "🎨" : "🤖";
            console.log(`${icon} ${m.name}`);
            console.log(`   Nombre: ${m.displayName}`);
            console.log(`   Métodos: ${m.supportedGenerationMethods.join(", ")}`);
            console.log("   ---");
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL LISTAR:");
        console.error(error.message);
        if (error.message.includes("404")) {
            console.log("💡 Esto suele significar que la API Key es inválida o el servicio 'Generative Language API' no está habilitado en tu consola de Google Cloud.");
        }
    }
}

check();
