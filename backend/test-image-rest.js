import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

const API_KEY = process.env.GOOGLE_IMAGEN_API_KEY || process.env.GEMINI_API_KEY;

async function testImage() {
    console.log("--- TEST DE GENERACIÓN DIRECTA (REST) ---");
    const model = "imagen-4.0-fast-generate-001";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${API_KEY}`;

    const body = {
        instances: [
            { prompt: "A minimalist professional logo for a tech startup, blue and white colors, vector style" }
        ],
        parameters: {
            sampleCount: 1
        }
    };



    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Status:", response.status);

        if (data.error) {
            console.error("X ERROR:", data.error.message);
            console.log(JSON.stringify(data.error, null, 2));
            return;
        }

        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
            fs.writeFileSync("rest-test.png", buffer);
            console.log("✓ IMAGEN GENERADA: rest-test.png");
        } else {
            console.log("? No se recibió imagen en la respuesta.");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("X ERROR CRÍTICO:", error.message);
    }
}

testImage();
