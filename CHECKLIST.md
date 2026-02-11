# ✅ Checklist de Verificación - BrandGen AI

## 🎯 Antes de Empezar

- [ ] Node.js instalado (v18+)
- [ ] Editor de código instalado (VS Code recomendado)
- [ ] Terminal/CMD funcionando
- [ ] Conexión a Internet estable
- [ ] Navegador moderno (Chrome/Firefox/Edge)

---

## 📦 Instalación Local

- [ ] Proyecto descargado/clonado
- [ ] `npm install` ejecutado exitosamente
- [ ] Dependencias instaladas sin errores
- [ ] Carpeta `node_modules/` creada

---

## 🔑 Configuración de API

- [ ] Cuenta de Google creada/disponible
- [ ] Acceso a Google AI Studio (https://aistudio.google.com/)
- [ ] API Key generada
- [ ] API Key copiada y guardada

**Tu API Key:**
```
AIzaSyCUs0r_RGNUNqhOJLxK8K4dQTT6bh25Zr8
```

- [ ] API Key configurada en la app (Ajustes → API)
- [ ] Badge "✓ Activo" visible

---

## 🚀 Ejecución

- [ ] `npm run dev` ejecutado
- [ ] Servidor iniciado en http://localhost:5173/
- [ ] App cargando correctamente en el navegador
- [ ] No hay errores en la consola del navegador (F12)

---

## 🧪 Pruebas Funcionales

### Crear Proyecto
- [ ] Click en "+ Nuevo Proyecto"
- [ ] Formulario se abre correctamente
- [ ] Todos los campos se pueden llenar
- [ ] Proyecto se crea exitosamente
- [ ] Proyecto aparece en la lista

### Generar Branding
- [ ] Click en "✨ Generar Branding"
- [ ] Loading spinner aparece
- [ ] Generación completa en 10-30 segundos
- [ ] 5 propuestas generadas
- [ ] Cada propuesta tiene:
  - [ ] Logo SVG
  - [ ] 6 colores con hex
  - [ ] 2 tipografías
  - [ ] 6 iconos

### Visualización
- [ ] Logos se muestran correctamente
- [ ] Colores con códigos hex visibles
- [ ] Tipografías cargadas
- [ ] Iconos renderizados
- [ ] Navegación entre propuestas funciona

### Chat con IA
- [ ] Widget de chat visible (esquina inferior derecha)
- [ ] Chat se abre al hacer click
- [ ] Mensajes se envían correctamente
- [ ] IA responde en 1-2 segundos
- [ ] Conversación se guarda

### Exportación
- [ ] Click en "Ver Guía Completa"
- [ ] Guía de marca se muestra
- [ ] Botones de exportación visibles:
  - [ ] Descargar PDF
  - [ ] Exportar a Figma
  - [ ] Copiar CSS

### Almacenamiento
- [ ] Proyectos se guardan automáticamente
- [ ] Al recargar página, proyectos persisten
- [ ] Ediciones se guardan
- [ ] API Key se mantiene configurada

---

## 🔧 Configuración Avanzada

### Ajustes Generales
- [ ] Idioma se puede cambiar
- [ ] Tema (Claro/Oscuro) funciona

### Webhooks
- [ ] Se pueden agregar URLs
- [ ] Webhooks se pueden activar/desactivar
- [ ] Webhooks se pueden eliminar

### Integración GoHighLevel
- [ ] Panel de integración visible
- [ ] Eventos listados correctamente

---

## 🐛 Verificación de Errores

### Consola del Navegador (F12)
- [ ] No hay errores en rojo
- [ ] No hay advertencias críticas
- [ ] Logs de generación visibles

### Casos de Error
- [ ] Sin API Key: Muestra datos mock
- [ ] API Key inválida: Muestra error claro
- [ ] Sin internet: Maneja gracefully
- [ ] Proyecto vacío: Validación funciona

---

## 📱 Responsive Design

- [ ] Se ve bien en desktop (1920x1080)
- [ ] Se ve bien en laptop (1366x768)
- [ ] Se ve bien en tablet (iPad)
- [ ] Se ve bien en móvil (iPhone)
- [ ] Navegación móvil funciona
- [ ] Chat móvil funciona

---

## 🔒 Seguridad

- [ ] API Key no visible en código fuente
- [ ] LocalStorage encriptado (navegador)
- [ ] Sin datos sensibles en URL
- [ ] HTTPS en producción (futuro)

---

## 📊 Performance

- [ ] Página carga en < 2 segundos
- [ ] Generación de branding en < 30 segundos
- [ ] UI responsive (sin lag)
- [ ] Memoria del navegador estable

---

## 🌐 Deploy (Opcional)

### Vercel
- [ ] Cuenta de Vercel creada
- [ ] Proyecto conectado a Git
- [ ] `vercel` CLI instalado
- [ ] Deploy exitoso
- [ ] URL pública funcionando

### Netlify
- [ ] Cuenta de Netlify creada
- [ ] Repositorio conectado
- [ ] Build command configurado: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Deploy exitoso

---

## 📚 Documentación

- [ ] README.md leído
- [ ] GUIA_DE_USO.md leído
- [ ] INSTRUCCIONES_LOCALHOST.md leído
- [ ] RESUMEN_TECNICO.md (para devs) revisado

---

## 🎨 Calidad de Branding Generado

### Logo
- [ ] Es profesional y escalable
- [ ] Tiene coherencia visual
- [ ] Los colores son apropiados
- [ ] Es único para cada propuesta

### Colores
- [ ] 6 colores generados
- [ ] Códigos hex válidos
- [ ] Usos descriptivos
- [ ] Paleta coherente

### Tipografías
- [ ] 2 fuentes de Google Fonts
- [ ] Son legibles
- [ ] Combinan bien
- [ ] Cargadas correctamente

### Iconos
- [ ] 6 iconos generados
- [ ] Estilo coherente con logo
- [ ] SVG válido
- [ ] Tamaño adecuado (24x24)

---

## 🔄 Flujo Completo (E2E)

- [ ] 1. Abrir app
- [ ] 2. Configurar API Key
- [ ] 3. Crear nuevo proyecto
- [ ] 4. (Opcional) Chatear con IA
- [ ] 5. Generar branding
- [ ] 6. Explorar 5 propuestas
- [ ] 7. Seleccionar favorita
- [ ] 8. Ver guía completa
- [ ] 9. Exportar en PDF
- [ ] 10. Guardar proyecto
- [ ] 11. Crear segundo proyecto
- [ ] 12. Ver lista de proyectos
- [ ] 13. Editar proyecto existente
- [ ] 14. Eliminar proyecto

---

## 🚨 Posibles Problemas y Soluciones

### Problema: "npm install" falla
- [ ] Borrar `node_modules` y `package-lock.json`
- [ ] Ejecutar `npm cache clean --force`
- [ ] Volver a ejecutar `npm install`

### Problema: Puerto 5173 ocupado
- [ ] Cerrar otras instancias de Vite
- [ ] Cambiar puerto en `vite.config.ts`: `server: { port: 3000 }`

### Problema: API Key no funciona
- [ ] Verificar que no tenga espacios al inicio/final
- [ ] Generar nueva key en Google AI Studio
- [ ] Verificar límites de uso diario

### Problema: Logos/iconos no se muestran
- [ ] Verificar consola del navegador
- [ ] Comprobar que el SVG sea válido
- [ ] Recargar página (Ctrl+Shift+R)

---

## 📝 Notas Importantes

### Límites de Google AI Studio (Free Tier)
- **Requests por minuto:** 15
- **Requests por día:** 1,500
- **Tokens por request:** 32,000

Si llegas al límite:
- Espera 60 segundos
- O espera al día siguiente
- O actualiza a plan de pago

### Almacenamiento LocalStorage
- **Límite:** ~5-10MB
- **Persistencia:** Hasta que se borre caché
- **Sincronización:** No (solo en este navegador)

### Compatibilidad de Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ❌ Internet Explorer (no compatible)

---

## 🎯 Métricas de Éxito

- [ ] La app funciona en localhost sin errores
- [ ] Se puede generar branding con IA
- [ ] Los logos son profesionales
- [ ] Las paletas de colores son coherentes
- [ ] Los iconos armonizan con el diseño
- [ ] La experiencia es fluida y rápida
- [ ] Los datos se persisten correctamente

---

## 📞 Soporte

Si algo no funciona:
1. Revisa este checklist completamente
2. Lee la documentación en `GUIA_DE_USO.md`
3. Busca el error específico en Google
4. Verifica la consola del navegador (F12)

---

## ✨ Siguiente Nivel

Cuando esto funcione perfecto:
- [ ] Subir a repositorio de Git
- [ ] Deploy a Vercel/Netlify
- [ ] Compartir con otros usuarios
- [ ] Implementar backend
- [ ] Agregar autenticación
- [ ] Monetizar

---

**Última actualización:** 2024  
**Versión del Checklist:** 1.0  
**Estado:** ✅ Listo para testing completo
