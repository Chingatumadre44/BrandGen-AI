import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
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
        // IMAGEN (Ideogram - Stream con Rate Limit)
        // ===============================
        if (type === "image") {
            // Esperar si ya hay una imagen procesándose para serializar
            while (isProcessingImage) {
                await delay(500);
            }

            isProcessingImage = true;

            try {
                // Delay obligatorio de 1200ms solicitado por el usuario
                await delay(1200);

                const stream = await replicate.run(
                    "ideogram-ai/ideogram-v3-turbo",
                    {
                        input: {
                            prompt: prompt,
                            aspect_ratio: "1:1",
                        },
                    }
                );

                // Convertir stream a buffer
                const chunks = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }

                const buffer = Buffer.concat(chunks);
                const base64Image = buffer.toString("base64");

                return res.json({
                    logo: `data:image/png;base64,${base64Image}`,
                });
            } catch (error) {
                if (error.status === 429 || error.message?.includes("429")) {
                    return res.status(429).json({
                        error: "Límite de Replicate alcanzado (6/min)",
                        details: "Por favor espera 1 minuto antes de intentar de nuevo."
                    });
                }
                throw error;
            } finally {
                isProcessingImage = false;
            }
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
