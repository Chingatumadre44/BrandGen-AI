import type { BrandProject, BrandBranding, BrandProposal, BrandColor, BrandIcon } from '../types';

// API Configuration
const BACKEND_URL = 'http://localhost:5000/api/generate';

// Helper to call backend API
async function callBackend(data: any): Promise<any> {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Initialize Gemini (Kept for UI compatibility but logic removed)
export function initializeAI(_apiKey: string): void {
  console.log('✅ AI service ready (using backend)');
}

// Check if AI is initialized (Always true if we assume backend is there)
export function isAIInitialized(): boolean {
  return true;
}

// Helper function to add delay between API calls
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate a summary from chat messages
export function generateContextSummary(messages: { role: string; content: string }[]): string {
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n');

  const assistantMessages = messages
    .filter(m => m.role === 'assistant')
    .map(m => m.content)
    .join('\n');

  return `
Conversación del usuario:
${userMessages}

Respuestas del asistente:
${assistantMessages}
  `.trim();
}

// ===== GENERATE BRANDING WITH MULTI-AGENT SYSTEM =====
export async function generateBranding(
  brandName: string,
  description: string,
  industry?: string,
  targetAudience?: string,
  chatContext?: string
): Promise<BrandBranding> {

  try {
    console.log('🎨 Starting Backend Branding Generation...', { brandName, industry });

    // ===== AGENTE 1: DIRECTOR CREATIVO =====
    const directorPrompt = `Actúa como un Director Creativo Senior de una agencia de branding premium.

ANÁLISIS DE MARCA:
- Nombre: ${brandName}
- Industria: ${industry || 'General'}
- Descripción: ${description}
- Público objetivo: ${targetAudience || 'General'}
${chatContext ? `\nContexto de conversación: ${chatContext}` : ''}

Tu tarea: Define 5 direcciones creativas ÚNICAS y DISTINTAS para esta marca.
Cada dirección debe tener:
1. Un nombre creativo para la propuesta
2. Descripción del concepto (2-3 oraciones)
3. Mood/Estilo: moderno, clásico, minimalista, audaz, elegante
4. Paleta de colores: 6 colores hexadecimales específicos con usos definidos
5. Tipografías: 2 fuentes de Google Fonts (una para títulos, una para cuerpo)
6. Descripción visual detallada para el logo (cómo debería verse)
7. Descripción del sistema de iconos (estilo visual)

Responde en JSON puro sin markdown.`;

    console.log('🎭 Agent 1: Director Creativo (Backend)...');
    const { result: creativeDirections } = await callBackend({
      type: "text",
      prompt: directorPrompt
    });
    console.log("RAW CREATIVE RESPONSE:", creativeDirections);
    // Clean JSON
    let cleanedJson = creativeDirections.trim();

    // Eliminar bloques markdown
    cleanedJson = cleanedJson.replace(/```json/g, '');
    cleanedJson = cleanedJson.replace(/```/g, '');

    // Detectar si el JSON empieza con array o con objeto
    const firstCurly = cleanedJson.indexOf('{');
    const firstBracket = cleanedJson.indexOf('[');

    let startIndex = -1;

    if (firstBracket !== -1 && (firstBracket < firstCurly || firstCurly === -1)) {
      startIndex = firstBracket;
    } else if (firstCurly !== -1) {
      startIndex = firstCurly;
    }

    if (startIndex !== -1) {
      cleanedJson = cleanedJson.substring(startIndex);
    }

    // Detectar cierre correcto
    const lastCurly = cleanedJson.lastIndexOf('}');
    const lastBracket = cleanedJson.lastIndexOf(']');

    let endIndex = -1;

    if (lastBracket > lastCurly) {
      endIndex = lastBracket;
    } else {
      endIndex = lastCurly;
    }

    if (endIndex !== -1) {
      cleanedJson = cleanedJson.substring(0, endIndex + 1);
    }
    const creativeData = JSON.parse(cleanedJson);
    console.log('✅ Creative directions defined:', creativeData.proposals?.length || creativeData.directions?.length);

    // ===== AGENTE 2: DISEÑADOR GRÁFICO (Genera Logos con Imagen 3 via Backend) =====
    console.log('🎨 Agent 2: Graphic Designer (Backend Imagen 3)...');

    const proposals = [];
    let directions: any[] = [];

    if (Array.isArray(creativeData)) {
      directions = creativeData;
    } else if (Array.isArray(creativeData.proposals)) {
      directions = creativeData.proposals;
    } else if (Array.isArray(creativeData.directions)) {
      directions = creativeData.directions;
    } else if (Array.isArray(creativeData.direcciones_creativas)) {
      directions = creativeData.direcciones_creativas;
    }

    if (!directions.length) {
      throw new Error("No se generaron propuestas desde el backend");
    }
    for (let i = 0; i < Math.min(5, directions.length); i++) {
      const direction = directions[i];

      // Normalización de datos para compatibilidad con nuevas claves de Gemini
      const rawColors =
        direction.colors ||
        direction.paleta_colores ||
        null;

      let normalizedColors: BrandColor[] | undefined;

      if (Array.isArray(rawColors)) {
        normalizedColors = rawColors;
      } else if (rawColors && typeof rawColors === "object") {
        normalizedColors = Object.entries(rawColors).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          hex: value as string,
          usage: `Color ${key}`
        }));
      }

      const rawTypography =
        direction.typography ||
        direction.tipografias ||
        null;

      let normalizedTypography = rawTypography;

      if (rawTypography && typeof rawTypography === "object") {
        normalizedTypography = {
          heading: {
            name: rawTypography.titulo || rawTypography.titulos || "Inter",
            fontFamily: `${rawTypography.titulo || rawTypography.titulos || "Inter"}, sans-serif`,
            usage: "Títulos",
            googleFont: rawTypography.titulo || rawTypography.titulos || "Inter"
          },
          body: {
            name: rawTypography.cuerpo || "DM Sans",
            fontFamily: `${rawTypography.cuerpo || "DM Sans"}, sans-serif`,
            usage: "Cuerpo",
            googleFont: rawTypography.cuerpo || "DM Sans"
          }
        };
      }

      const normalizedDirection = {
        ...direction,
        colors: normalizedColors,
        typography: normalizedTypography,
        logoDescription:
          direction.logoDescription ||
          direction.descripcion_logo ||
          direction.logo,
        iconStyle:
          direction.iconStyle ||
          direction.sistema_iconos
      };

      let logoImageUrl = '';

      // limitación: Solo la primera propuesta genera logo real
      if (i === 0) {
        const logoPrompt = `Professional logo design for "${brandName}". ${normalizedDirection.visualDescription || normalizedDirection.logoDescription || 'Modern and professional design'}.
Style: ${normalizedDirection.mood || 'modern'}.
Colors: ${normalizedDirection.colors?.map((c: any) => c.hex || c).join(', ') || '#6366f1, #8b5cf6'}.
Industry: ${industry || 'technology'}.
The logo should be clean, scalable, suitable for business use. Centered composition, white or transparent background, high quality, vector-style appearance.`;

        try {
          const imageRes = await callBackend({
            type: "image",
            prompt: logoPrompt
          });
          await delay(250);
          logoImageUrl = imageRes.logo;
          console.log(`✅ Logo ${i + 1} generated`);
        } catch (error) {
          console.error(`❌ Error generating logo ${i + 1}:`, error);
          logoImageUrl = generatePlaceholderLogo(brandName, normalizedDirection.colors?.[0]?.hex || '#6366f1');
        }
      } else {
        // Fallback para propuestas secundarias
        logoImageUrl = generatePlaceholderLogo(brandName, normalizedDirection.colors?.[0]?.hex || '#6366f1');
      }

      // Generate icons for this proposal
      const icons = [];

      // limitación: Solo la primera propuesta genera iconos reales (4 iconos)
      if (i === 0) {
        console.log(`🎨 Generating 4 real icons for proposal ${i + 1}...`);
        const iconNames = ['home', 'search', 'user', 'settings'];

        for (const iconName of iconNames) {
          const iconPrompt = `Simple icon of ${iconName} for "${brandName}" brand. ${normalizedDirection.iconStyle || normalizedDirection.visualDescription || ''}.
Style: ${normalizedDirection.mood || 'modern'}, minimalist, line icon style.
Colors: ${normalizedDirection.colors?.[0]?.hex || '#6366f1'}.
Clean, simple, suitable for UI/UX. White background, centered.`;

          try {
            const iconRes = await callBackend({
              type: "image",
              prompt: iconPrompt
            });
            await delay(250);
            icons.push({
              name: iconName,
              svg: iconRes.logo,
              description: `Icono de ${iconName}`,
            });
          } catch (error) {
            console.error(`❌ Error generating icon ${iconName}:`, error);
            icons.push(generateFallbackIcon(iconName));
          }
        }
      } else {
        // Fallback para iconos de propuestas secundarias
        const fallbackIconNames = ['home', 'search', 'user', 'settings', 'heart', 'star'];
        for (const iconName of fallbackIconNames) {
          icons.push(generateFallbackIcon(iconName));
        }
      }

      proposals.push({
        id: i + 1,
        name: normalizedDirection.name || `Propuesta ${i + 1}`,
        description: normalizedDirection.description || `Diseño ${normalizedDirection.mood || 'modern'} para ${brandName}`,
        mood: normalizedDirection.mood || 'modern',
        logo: logoImageUrl,
        colorScheme: normalizedDirection.colors?.map((c: any) => c.hex || c) || ['#6366f1', '#8b5cf6', '#ec4899', '#f9fafb', '#111827', '#ffffff'],
        colors: normalizedDirection.colors || generateFallbackColors(),
        typography: normalizedDirection.typography || {
          heading: { name: 'Inter', fontFamily: 'Inter, sans-serif', usage: 'Títulos', googleFont: 'Inter' },
          body: { name: 'DM Sans', fontFamily: 'DM Sans, sans-serif', usage: 'Cuerpo', googleFont: 'DM+Sans' }
        },
        icons: icons,
        applications: ['Website', 'Redes sociales', 'Tarjetas de presentación', 'Email firma', 'Empaque'],
      });
    }

    if (!proposals.length) {
      throw new Error("No se generaron propuestas desde el backend");
    }

    const mainProposal = proposals[0];

    return {
      brandName,
      tagline: generateTagline(brandName, description),
      logo: mainProposal.logo,
      colors: mainProposal.colors,
      typography: mainProposal.typography,
      icons: mainProposal.icons,
      proposals: proposals.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        colorScheme: p.colorScheme,
        typography: `${p.typography.heading.name} + ${p.typography.body.name}`,
        mood: p.mood,
        applications: p.applications,
      })),
    };

  } catch (error) {
    console.error('❌ Error in backend branding generation:', error);
    return generateFallbackBranding(brandName, description);
  }
}

// Helper function to generate placeholder logo
function generatePlaceholderLogo(brandName: string, color: string): string {
  const initial = brandName.charAt(0).toUpperCase();
  return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="40" fill="${color}"/>
    <text x="100" y="140" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
  </svg>`)}`;
}

// Helper function to generate fallback colors
function generateFallbackColors(): BrandColor[] {
  return [
    { name: 'Primario', hex: '#6366f1', usage: 'Color principal' },
    { name: 'Secundario', hex: '#8b5cf6', usage: 'Elementos de apoyo' },
    { name: 'Acento', hex: '#ec4899', usage: 'Llamadas a la acción' },
    { name: 'Fondo Claro', hex: '#f9fafb', usage: 'Backgrounds' },
    { name: 'Fondo Oscuro', hex: '#111827', usage: 'Texto sobre oscuro' },
    { name: 'Soporte', hex: '#ffffff', usage: 'Tarjetas' },
  ];
}

// Helper function to generate fallback icon
function generateFallbackIcon(name: string): BrandIcon {
  const iconPaths: Record<string, string> = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  };

  return {
    name,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconPaths[name] || iconPaths.star}</svg>`,
    description: `Icono de ${name}`,
  };
}

// ===== AI CHAT RESPONSES (Via Backend) =====
export async function getAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `Eres BrandGen AI, un diseñador experto y asistente de branding.
Tu objetivo principal es hacerle preguntas al usuario sobre su empresa para crearle una identidad de marca profesional (logo, paletas, tipografías).

REGLAS OBLIGATORIAS:
1. Haz SOLO UNA pregunta a la vez. No abrume al usuario.
2. NUNCA repitas una pregunta que ya hayas hecho o sobre la que el usuario ya te haya dado información. Analiza el historial cuidadosamente.
3. Sé profesional, amable y extremadamente conciso (máximo 2 a 3 oraciones por respuesta).
4. La información clave que necesitas saber de la empresa es:
   - Su público objetivo.
   - Su propuesta de valor o qué la hace única.
   - Si prefiere algún estilo visual o colores (moderno, elegante, corporativo, colorido).
5. Si consideras que el usuario ya ha proporcionado suficiente información sobre esos puntos (o si el usuario dice que ya terminó o quiere generar el logo), debes decirle EXPLÍCITAMENTE esto: 
   "¡Perfecto! Tengo toda la información que necesito para crear algo increíble. Por favor, haz clic en el botón superior que dice '✨ Generar Branding' para que pueda entregarte las 5 propuestas con tus logos e iconos reales."
`;

    const { result } = await callBackend({
      type: "chat",
      history,
      systemInstruction
    });

    return result;

  } catch (error) {
    console.error('❌ Error in backend AI chat:', error);
    return getFallbackChatResponse(messages);
  }
}

// ===== FALLBACK FUNCTIONS (When AI not available) =====
function generateFallbackBranding(brandName: string, description: string): BrandBranding {
  const colors: BrandColor[] = [
    { name: 'Primario', hex: '#6366f1', usage: 'Color principal de marca' },
    { name: 'Secundario', hex: '#8b5cf6', usage: 'Elementos de apoyo' },
    { name: 'Acento', hex: '#ec4899', usage: 'Llamadas a la acción' },
    { name: 'Fondo Claro', hex: '#f9fafb', usage: 'Fondos y backgrounds' },
    { name: 'Fondo Oscuro', hex: '#111827', usage: 'Texto sobre fondos oscuros' },
    { name: 'Soporte', hex: '#ffffff', usage: 'Tarjetas y contenedores' },
  ];

  const typography = {
    heading: {
      name: 'Inter',
      fontFamily: 'Inter, sans-serif',
      usage: 'Títulos y encabezados',
      googleFont: 'Inter'
    },
    body: {
      name: 'DM Sans',
      fontFamily: 'DM Sans, sans-serif',
      usage: 'Texto de párrafos',
      googleFont: 'DM+Sans'
    },
  };

  const icons: BrandIcon[] = [
    { name: 'home', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>', description: 'Home' },
    { name: 'search', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>', description: 'Search' },
    { name: 'user', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', description: 'User' },
    { name: 'settings', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>', description: 'Settings' },
    { name: 'heart', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', description: 'Favorite' },
    { name: 'star', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', description: 'Star' },
  ];

  // Generate a simple logo based on brand name
  const initial = brandName.charAt(0).toUpperCase();
  const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1"/>
        <stop offset="100%" style="stop-color:#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="40" fill="url(#grad)"/>
    <text x="100" y="140" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
  </svg>`;

  const moods = ['modern', 'classic', 'minimalist', 'bold', 'elegant'];
  const proposalNames = ['Innovador', 'Tradicional', 'Puro', 'Audaz', 'Sofisticado'];

  const proposals: BrandProposal[] = moods.map((mood, i) => ({
    id: i + 1,
    name: `${proposalNames[i]} ${brandName}`,
    description: `Una propuesta ${mood} que captura la esencia de ${brandName}. ${description}`,
    colorScheme: colors.map(c => c.hex),
    typography: 'Inter + DM Sans',
    mood,
    applications: ['Website', 'Business cards', 'Social media', 'Email signature'],
  }));

  return {
    brandName,
    tagline: generateTagline(brandName, description),
    logo,
    colors,
    typography,
    icons,
    proposals,
  };
}

function getFallbackChatResponse(messages: { role: string; content: string }[]): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  const userMessageCount = messages.filter(m => m.role === 'user').length;

  if (userMessageCount === 0) {
    return "¡Hola! Soy BrandGen AI, tu asistente de branding. Cuéntame sobre tu empresa o marca. ¿Qué nombre tiene y a qué se dedica?";
  }

  if (lastMessage.includes('logo') || lastMessage.includes('diseño')) {
    return "¿Te gustaría un diseño moderno y minimalista, o prefieres algo más tradicional y elegante?";
  }

  if (lastMessage.includes('color')) {
    return "Perfecto con los colores. ¿Tienes alguna preferencia de tipografía? ¿Prefieres fuentes modernas o clásicas?";
  }

  if (userMessageCount < 3) {
    return "¿Hay algo más que deba saber sobre tu marca? Por ejemplo, ¿quién es tu público objetivo o qué valores quieres transmitir?";
  }

  const closingResponses = [
    "Tengo toda la información que necesito. ¿Listo para generar tu branding? Haz clic en '✨ Generar Branding'",
    "Perfecto, tu marca suena muy interesante. ¿Quieres que genere las propuestas de branding ahora?",
    "¡Excelente! Con toda esta información podré crear un branding perfecto para ti. ¿Generamos las propuestas?",
  ];

  return closingResponses[Math.floor(Math.random() * closingResponses.length)];
}

function generateTagline(brandName: string, _description: string): string {
  const taglines = [
    `Innovación que transforma`,
    `Tu socio de confianza`,
    `Excelencia en cada detalle`,
    `Creatividad sin límites`,
    `Diseñado para ti`,
    `Calidad garantizada`,
    `El futuro de tu marca`,
  ];

  const index = Math.abs(brandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % taglines.length;
  return taglines[index];
}

// ===== PROJECT MANAGEMENT =====
export function saveProject(project: BrandProject): void {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem('brandgen_projects', JSON.stringify(projects));
}

export function getProjects(): BrandProject[] {
  const stored = localStorage.getItem('brandgen_projects');
  return stored ? JSON.parse(stored) : [];
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem('brandgen_projects', JSON.stringify(projects));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== API KEY MANAGEMENT (UI Compatibility) =====
export function saveApiKey(apiKey: string): void {
  localStorage.setItem('brandgen_api_key', apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem('brandgen_api_key');
}

export function deleteApiKey(): void {
  localStorage.removeItem('brandgen_api_key');
}
