# 🎨 BrandGen AI - Guía de Uso Completa

## 📦 Instalación en tu Computadora (Localhost)

### Paso 1: Requisitos Previos
Asegúrate de tener instalado **Node.js** (versión 18 o superior).

Verifica en la terminal:
```bash
node --version
```

Si no lo tienes, descárgalo de: https://nodejs.org/

---

### Paso 2: Descargar el Proyecto

Opción A - **Si tienes el código en una carpeta:**
```bash
cd ruta/a/tu/proyecto
```

Opción B - **Si usas Git:**
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd brandgen-ai
```

---

### Paso 3: Instalar Dependencias
En la carpeta del proyecto, ejecuta:
```bash
npm install
```

Esto descargará todas las librerías necesarias (React, Vite, Tailwind, Google AI, etc.)

---

### Paso 4: Configurar tu API Key de Google AI Studio

1. Ve a: **https://aistudio.google.com/app/apikey**
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Get API Key"** o **"Create API Key"**
4. Copia la clave (empieza con `AIza...`)

**Tu API Key actual:**
```
AIzaSyCUs0r_RGNUNqhOJLxK8K4dQTT6bh25Zr8
```

---

### Paso 5: Ejecutar la Aplicación en Localhost
```bash
npm run dev
```

Verás algo como:
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en: **http://localhost:5173/**

---

## 🔑 Configurar la API en la Aplicación

### Opción 1: Desde la Interfaz (Recomendado)

1. Abre la app en `http://localhost:5173/`
2. Haz clic en el icono de **"Ajustes"** ⚙️ (esquina superior derecha)
3. Ve a la pestaña **"API"**
4. Pega tu API Key en el campo **"Google AI Studio (Gemini)"**
5. Haz clic en **"Guardar"**
6. Verás un badge verde **"✓ Activo"**

### Opción 2: Hardcodear la API (Para testing rápido)

Edita el archivo `src/services/brandingService.ts` al final:

```typescript
// Auto-initialize on load
const storedKey = getApiKey();
if (storedKey) {
  initializeAI(storedKey);
} else {
  // 👇 AGREGA ESTA LÍNEA CON TU API KEY
  initializeAI('AIzaSyCUs0r_RGNUNqhOJLxK8K4dQTT6bh25Zr8');
}
```

⚠️ **Importante:** Si hardcodeas la API Key, **NO** subas el código a repositorios públicos.

---

## 🚀 Cómo Usar la Aplicación

### 1️⃣ Crear un Proyecto
- Haz clic en **"+ Nuevo Proyecto"**
- Completa el formulario:
  - **Nombre**: Nombre de la marca
  - **Industria**: Tecnología, Salud, Educación, etc.
  - **Descripción**: Breve descripción de la empresa
  - **Público objetivo**: Quién es tu cliente ideal
- Haz clic en **"Crear Proyecto"**

### 2️⃣ Chatear con la IA (Opcional)
- Usa el **widget de chat** 💬 (esquina inferior derecha)
- Refina detalles de tu marca conversando con la IA
- Puedes describir valores, estilos preferidos, competidores, etc.

### 3️⃣ Generar el Branding
- Haz clic en **"✨ Generar Branding"**
- La IA procesará tu información (toma 10-30 segundos)
- Se generarán **5 propuestas diferentes**

### 4️⃣ Explorar las Propuestas
Cada propuesta incluye:
- **Logo en SVG** (escalable, profesional)
- **6 Colores** con códigos hex y usos específicos
- **2 Tipografías** (títulos + cuerpo de texto)
- **6 Iconos** con estilo coherente con el logo

### 5️⃣ Exportar la Guía de Marca
- Haz clic en **"Ver Guía Completa"**
- Descarga en formatos:
  - **PDF**: Documento completo
  - **Figma**: Exportar colores y tipografías
  - **CSS**: Variables de CSS listas para usar

---

## 📂 Almacenamiento de Datos

### Dónde se Guardan los Proyectos

Por ahora, todo se guarda en **localStorage** de tu navegador:
- Proyectos creados
- Branding generado
- API Key de Google
- Configuraciones

**Ubicación:** `localStorage` → Inspecciona en DevTools (F12) → Application → Local Storage

### Futuro: Backend y Base de Datos

Para una app en producción, recomendamos:

1. **Backend con Node.js + Express**
2. **Base de datos:**
   - MongoDB (flexible, NoSQL)
   - PostgreSQL (relacional, robusto)
   - Supabase (backend as a service, gratis)
3. **Autenticación:** Firebase Auth o Auth0
4. **Almacenamiento de imágenes:** Cloudinary o AWS S3

---

## 🔗 Preparar para Repositorio (GitHub)

### 1. Crear archivo `.gitignore`
Crea un archivo `.gitignore` en la raíz del proyecto:

```
node_modules/
dist/
.env
.DS_Store
```

### 2. Inicializar Git
```bash
git init
git add .
git commit -m "Initial commit: BrandGen AI v1.0"
```

### 3. Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un nuevo repositorio (ej: `brandgen-ai`)
3. **NO** inicialices con README (ya tienes código)

### 4. Subir el Código
```bash
git remote add origin https://github.com/TU_USUARIO/brandgen-ai.git
git branch -M main
git push -u origin main
```

---

## 🌐 Deploy a Producción

### Opción 1: Vercel (Recomendado - Gratis)
```bash
npm install -g vercel
vercel
```

Sigue las instrucciones. En minutos tendrás tu app en: `https://tu-app.vercel.app`

### Opción 2: Netlify
1. Sube tu repo a GitHub
2. Ve a https://app.netlify.com/
3. Conecta tu repositorio
4. Deploy automático

### Opción 3: GitHub Pages
```bash
npm run build
```
Sube la carpeta `dist/` a GitHub Pages

---

## 🔌 Integración con GoHighLevel

### Webhooks Disponibles
En **Ajustes → Webhooks**, configura URLs para recibir notificaciones:

- `project.created`: Cuando se crea un proyecto
- `project.completed`: Cuando se completa el branding
- `branding.generated`: Cuando la IA genera propuestas
- `export.completed`: Cuando se exporta la guía

### Conectar con GoHighLevel
1. En GoHighLevel, ve a **Settings → Integrations → Webhooks**
2. Crea un nuevo webhook apuntando a tu app
3. En BrandGen AI, configura el endpoint en **Ajustes → Integración**

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo (localhost)
npm run dev

# Compilar para producción
npm run build

# Vista previa de la build
npm run preview

# Instalar nueva librería
npm install nombre-libreria

# Actualizar dependencias
npm update
```

---

## ❓ Solución de Problemas

### La IA no genera branding (muestra datos mock)
✅ Verifica que tu API Key esté configurada en Ajustes → API
✅ Revisa la consola del navegador (F12) para ver errores
✅ Asegúrate de tener conexión a Internet

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### La app no se ve correctamente
✅ Borra caché del navegador (Ctrl+Shift+R)
✅ Verifica que Tailwind esté cargando

### No se guardan los proyectos
✅ Verifica que localStorage no esté deshabilitado
✅ Prueba en modo incógnito para descartar extensiones

---

## 📧 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que la API Key sea válida
3. Asegúrate de tener Node.js 18+

---

## 🎯 Próximos Pasos

- [ ] Conectar a backend real (Node.js + MongoDB)
- [ ] Autenticación de usuarios
- [ ] Exportar logos a PNG/JPG
- [ ] Editor de logos en tiempo real
- [ ] Integración completa con GoHighLevel
- [ ] Pasarela de pago (Stripe)
- [ ] Compartir proyectos por link

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo.

---

**¡Disfruta creando branding increíble con IA! 🎨✨**
