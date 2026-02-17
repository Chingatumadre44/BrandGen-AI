import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY no encontrada en el entorno.");
    console.error("Por favor, asegúrate de tener un archivo .env en la carpeta /backend con la clave:");
    console.error("GEMINI_API_KEY=tu_clave_aqui");
    process.exit(1);
}

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

const aiImageKey = process.env.GOOGLE_IMAGEN_API_KEY || GEMINI_API_KEY;
const aiImage = new GoogleGenAI({
    apiKey: aiImageKey,
});


// Helper para delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Semaphore simple para serializar llamadas a Replicate y evitar 429
let isProcessingImage = false;

app.post("/api/generate", async (req, res) => {
    try {
        const { type, prompt, history, systemInstruction } = req.body;

        if (!prompt && type !== "chat") {
            return res.status(400).json({ error: "Prompt requerido" });
        }

        // ===============================
        // TEXTO (Gemini)
        // ===============================
        if (type === "text") {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            return res.json({ result: response.text });
        }


        // ===============================
        // IMAGEN (Google Imagen 4.0 Fast via REST API)
        // ===============================
        if (type === "image") {
            // Esperar si ya hay una imagen procesándose para serializar
            while (isProcessingImage) {
                await delay(500);
            }

            isProcessingImage = true;

            try {
                // Delay para no saturar la cuota
                await delay(1000);

                const model = "imagen-4.0-fast-generate-001";
                const apiKey = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GEMINI_API_KEY;
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;

                console.log(`Generando imagen con ${model} (REST)...`);
                console.log("Prompt:", prompt);

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        instances: [
                            { prompt: prompt }
                        ],
                        parameters: {
                            sampleCount: 1
                        }
                    })
                });

                const data = await response.json();

                if (data.error) {
                    console.error("Error de API Imagen:", data.error);
                    throw new Error(data.error.message || "Error desconocido en la API de Imagen");
                }

                // Extraer imagen base64 de la respuesta REST
                const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded;

                if (!imageBase64) {
                    console.error("Respuesta de API sin predicciones:", JSON.stringify(data, null, 2));
                    throw new Error("No se recibió imagen base64 de Google Imagen");
                }

                const imageUrl = `data:image/png;base64,${imageBase64}`;

                console.log("✓ Imagen generada exitosamente (REST)");

                return res.json({
                    logo: imageUrl,
                });
            } catch (error) {
                console.error("=== ERROR EN GENERACIÓN DE IMAGEN (REST) ===");
                console.error(error.message);

                res.status(500).json({
                    error: "Error procesando solicitud de IA (Imagen)",
                    details: error.message
                });
                return;
            } finally {
                isProcessingImage = false;
            }
            return;
        }


        // ===============================
        // CHAT (Gemini)
        // ===============================
        if (type === "chat") {
            const chatResponse = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                systemInstruction:
                    systemInstruction ||
                    "Eres un asistente experto en branding. Responde claro y directo.",
                contents: history || [],
            });

            return res.json({ result: chatResponse.text });
        }

        const defaultResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        res.json({ result: defaultResponse.text });

    } catch (error) {
        console.error("ERROR EN BACKEND:", error);
        res.status(500).json({
            error: "Error procesando solicitud de IA",
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de Branding corriendo en http://localhost:${PORT}`);
});
