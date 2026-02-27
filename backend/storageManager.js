import { db } from "./firebaseAdmin.js";
import { put, del } from "@vercel/blob";

/**
 * Guarda un proyecto de branding completo utilizando Firestore para datos y Vercel Blob para imágenes.
 * @param {Object} project El proyecto a guardar.
 */
export async function saveProject(project) {
    const projectId = project.id;

    // Helper para guardar una imagen base64 en Vercel Blob y devolver su URL pública
    const saveImage = async (base64Data, prefix) => {
        if (!base64Data || !base64Data.startsWith("data:image")) return base64Data;

        try {
            const buffer = Buffer.from(base64Data.split(",")[1], "base64");
            const fileName = `projects/${projectId}/${prefix}_${Date.now()}.png`;

            // Subimos a Vercel Blob
            const { url } = await put(fileName, buffer, {
                access: 'public',
                contentType: 'image/png'
            });

            return url;
        } catch (e) {
            console.error(`❌ Error saving image ${prefix} to Vercel Blob:`, e);
            return base64Data;
        }
    };

    // Procesar branding y subcomponentes para subir imágenes a Blob
    if (project.branding) {
        if (project.branding.logo) {
            project.branding.logo = await saveImage(project.branding.logo, "logo_main");
        }

        if (project.branding.icons && Array.isArray(project.branding.icons)) {
            for (let i = 0; i < project.branding.icons.length; i++) {
                project.branding.icons[i].svg = await saveImage(project.branding.icons[i].svg, `icon_main_${i}`);
            }
        }

        if (project.branding.proposals && Array.isArray(project.branding.proposals)) {
            for (let i = 0; i < project.branding.proposals.length; i++) {
                const proposal = project.branding.proposals[i];
                if (proposal.logo) {
                    proposal.logo = await saveImage(proposal.logo, `logo_prop_${i}`);
                }
                if (proposal.icons && Array.isArray(proposal.icons)) {
                    for (let j = 0; j < proposal.icons.length; j++) {
                        proposal.icons[j].svg = await saveImage(proposal.icons[j].svg, `icon_prop_${i}_${j}`);
                    }
                }
            }
        }
    }

    // Guardar el documento en Firestore
    const projectRef = db.collection("projects").doc(projectId);
    await projectRef.set({
        ...project,
        updatedAt: new Date().toISOString()
    });

    console.log(`✅ Proyecto ${projectId} sincronizado en Firestore + Vercel Blob.`);
    return project;
}

/**
 * Obtiene todos los proyectos desde Firestore.
 */
export async function getProjects() {
    try {
        const snapshot = await db.collection("projects").orderBy("updatedAt", "desc").get();
        const projects = [];
        snapshot.forEach(doc => {
            projects.push(doc.data());
        });
        return projects;
    } catch (error) {
        console.error("❌ Error obteniendo proyectos de Firestore:", error);
        return [];
    }
}

/**
 * Obtiene un proyecto específico por ID desde Firestore.
 */
export async function getProjectById(id) {
    try {
        const doc = await db.collection("projects").doc(id).get();
        if (!doc.exists) return null;
        return doc.data();
    } catch (error) {
        console.error(`❌ Error obteniendo proyecto ${id}:`, error);
        return null;
    }
}

/**
 * Elimina un proyecto de Firestore. 
 * Nota: Vercel Blob no permite eliminación masiva por prefijo fácilmente sin listar, 
 * por lo que aquí nos enfocamos en Firestore.
 */
export async function deleteProject(id) {
    try {
        await db.collection("projects").doc(id).delete();
        return true;
    } catch (error) {
        console.error(`❌ Error eliminando proyecto ${id}:`, error);
        return false;
    }
}

/**
 * Mantenido por compatibilidad de firma.
 */
export function getImagePhysicalPath(projectId, imageName) {
    return null;
}
