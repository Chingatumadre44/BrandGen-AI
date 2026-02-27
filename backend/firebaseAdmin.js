import admin from "firebase-admin";

// Inicialización de Firebase Admin usando variables de entorno
let app;
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin inicializado correctamente para Firestore.");
    } catch (error) {
        console.error("❌ Error inicializando Firebase Admin:", error.message);
        console.warn("Asegúrate de configurar la variable FIREBASE_SERVICE_ACCOUNT en el panel de Vercel.");
    }
} else {
    app = admin.app();
}

export const db = admin.firestore();
export default app;
