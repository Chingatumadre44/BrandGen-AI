import fs from "fs";


async function verifyBackend() {
    console.log("--- VERIFICACIÓN DEL BACKEND (/api/generate) ---");
    const url = "http://localhost:5000/api/generate";

    const body = {
        type: "image",
        prompt: "A futuristic elegant logo for a brand called 'Antigravity AI', cosmic blue colors, vector style"
    };

    try {
        console.log("Enviando solicitud al backend...");
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Status:", response.status);

        if (data.error) {
            console.error("X ERROR EN BACKEND:", data.error);
            if (data.details) console.error("Detalles:", data.details);
            return;
        }

        if (data.logo) {
            const base64Data = data.logo.replace(/^data:image\/png;base64,/, "");
            fs.writeFileSync("backend-test-logo.png", Buffer.from(base64Data, "base64"));
            console.log("✓ IMAGEN GENERADA POR EL BACKEND: backend-test-logo.png");
        } else {
            console.log("? Respuesta inesperada:", data);
        }
    } catch (error) {
        console.error("X ERROR DE CONEXIÓN:", error.message);
        console.log("¿Está el servidor backend corriendo? (npm run dev o node server.js)");
    }
}

verifyBackend();
