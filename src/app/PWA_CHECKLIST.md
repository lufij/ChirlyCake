# ✅ Checklist de Configuración PWA

## 📋 Antes de Instalar en Tabletas

### 1. Archivos PWA Base (✅ Ya Creados)
- [x] `/public/manifest.json` - Configuración de la PWA
- [x] `/public/service-worker.js` - Service Worker para cache
- [x] `/components/PWAHead.tsx` - Meta tags
- [x] `/components/PWAInstaller.tsx` - Prompt de instalación
- [x] `App.tsx` actualizado con componentes PWA

### 2. Iconos de la Aplicación (⚠️ PENDIENTE)
Necesitas crear los iconos antes de instalar:

- [ ] Abre `/public/icons/generate-placeholder-icons.html` en tu navegador
- [ ] Haz clic en "Descargar Todos"
- [ ] Guarda los 8 iconos en `/public/icons/` con estos nombres exactos:
  - [ ] `icon-72x72.png`
  - [ ] `icon-96x96.png`
  - [ ] `icon-128x128.png`
  - [ ] `icon-144x144.png`
  - [ ] `icon-152x152.png`
  - [ ] `icon-192x192.png`
  - [ ] `icon-384x384.png`
  - [ ] `icon-512x512.png`

**Alternativa:** Crea tus propios iconos con tu logo (ver `/public/icons/ICON_INSTRUCTIONS.md`)

### 3. Deployment (🔒 CRÍTICO)
La PWA **requiere HTTPS** para funcionar:

- [ ] La aplicación está deployada en un servidor HTTPS
- [ ] La URL es accesible desde las tabletas Sunmi
- [ ] El certificado SSL es válido
- [ ] No hay errores de seguridad en la consola del navegador

> **Nota:** En localhost funciona sin HTTPS solo para desarrollo

---

## 📱 Instalación en Tabletas Sunmi

### Paso 1: Preparar la Tableta
- [ ] Chrome está actualizado a la última versión
- [ ] Hay conexión a internet estable (WiFi o 4G)
- [ ] Puedes acceder a la URL de la aplicación desde el navegador

### Paso 2: Primera Instalación
- [ ] Abre Chrome en la tableta Sunmi
- [ ] Navega a la URL de tu aplicación
- [ ] Espera a que aparezca el prompt "Instalar Pastelería Pro"
- [ ] Presiona "Instalar"
- [ ] Verifica que aparece el icono en la pantalla de inicio

**Si no aparece el prompt:**
- [ ] Toca menú (⋮) → "Agregar a pantalla de inicio"
- [ ] O toca menú (⋮) → "Instalar app"

### Paso 3: Verificación
- [ ] El icono está en la pantalla de inicio de Android
- [ ] Al abrir, no se ve la barra de direcciones de Chrome
- [ ] La app se abre en pantalla completa
- [ ] Funciona la navegación entre secciones
- [ ] Se pueden crear pedidos

---

## 🧪 Pruebas de Funcionalidad PWA

### Funcionalidad Online
- [ ] Se cargan todos los pedidos desde el servidor
- [ ] Se pueden crear nuevos pedidos
- [ ] Se pueden subir imágenes
- [ ] El calendario muestra los pedidos
- [ ] Los reportes funcionan correctamente

### Funcionalidad Offline (Limitada)
- [ ] Cierra completamente la app
- [ ] Activa modo avión en la tableta
- [ ] Vuelve a abrir la app
- [ ] Verifica que la interfaz se carga
- [ ] Los datos previamente cargados son visibles
- [ ] Aparece mensaje cuando intentas crear/editar sin conexión

### Service Worker
- [ ] Abre Chrome DevTools en desktop (para debugging)
- [ ] Ve a Application → Service Workers
- [ ] Verifica que está activo y sin errores
- [ ] Ve a Application → Cache Storage
- [ ] Verifica que hay archivos cacheados

### Actualizaciones
- [ ] Haz un cambio pequeño en la app
- [ ] Deploy la nueva versión
- [ ] Abre la PWA en la tableta (puede tardar unos segundos)
- [ ] Verifica que se actualiza automáticamente

---

## ⚙️ Configuración Recomendada Tableta Sunmi

### Ajustes de Pantalla
- [ ] **Brillo:** Alto o automático
- [ ] **Tiempo de espera:** 5-30 minutos (o nunca durante horario laboral)
- [ ] **Mantener activa mientras carga:** Activado
- [ ] **Rotación automática:** Desactivada (mantener portrait)

### Ajustes de Ahorro de Energía
- [ ] **Modo ahorro batería:** Desactivado (o excluir la PWA)
- [ ] **Optimización batería:** Desactivada para Chrome
- [ ] **Cierre de apps en segundo plano:** Desactivado para la PWA

### Ajustes de Red
- [ ] **WiFi:** Conectado y estable
- [ ] **Red móvil:** Habilitada como backup (opcional)
- [ ] **Ahorro de datos:** Desactivado

### Modo Kiosk (Opcional - Para Tableta Dedicada)
- [ ] Instalar app "Kiosk Browser" o similar
- [ ] Configurar URL de la PWA
- [ ] Activar bloqueo de navegación
- [ ] Configurar PIN de salida
- [ ] Ocultar barra de notificaciones

---

## 🐛 Solución de Problemas Comunes

### ❌ Problema: No aparece el botón de instalar
**Posibles causas:**
- [ ] No estás en HTTPS (verifica la URL)
- [ ] Ya está instalada (busca en pantalla de inicio)
- [ ] El navegador no es Chrome (cambia a Chrome)
- [ ] Falta el manifest.json (verifica deployment)

**Solución:**
- [ ] Usa método manual: Menú → "Agregar a pantalla de inicio"

### ❌ Problema: Pantalla blanca al abrir la PWA
**Posibles causas:**
- [ ] No hay conexión a internet
- [ ] Error en el service worker
- [ ] URL incorrecta en manifest.json

**Solución:**
- [ ] Verifica conexión a internet
- [ ] Desinstala y reinstala la PWA
- [ ] Revisa console de Chrome DevTools

### ❌ Problema: No se actualiza la aplicación
**Solución:**
- [ ] Cierra completamente la app (desliza desde apps recientes)
- [ ] Borra caché: Chrome → Configuración → Privacidad → Borrar caché
- [ ] Vuelve a abrir la PWA

### ❌ Problema: Los iconos no aparecen
**Solución:**
- [ ] Verifica que los 8 archivos PNG están en `/public/icons/`
- [ ] Verifica que tienen los nombres exactos (icon-72x72.png, etc.)
- [ ] Redeploy la aplicación
- [ ] Desinstala y reinstala la PWA

---

## 📊 Verificación Final

### Checklist de Producción Ready:
- [ ] PWA instalada en al menos una tableta Sunmi
- [ ] Usuario propietario creado y funcional
- [ ] Al menos 1 pedido de prueba creado exitosamente
- [ ] Calendario muestra pedidos correctamente
- [ ] Reportes generan datos (aunque sea con datos de prueba)
- [ ] Se probó crear cliente nuevo desde formulario de pedidos
- [ ] Se probó editar pedido existente (solo propietario)
- [ ] Se probaron botones de cambio rápido de estado
- [ ] Navegación entre pestañas funciona fluida
- [ ] Sin errores en consola del navegador

### Checklist de Equipo:
- [ ] Propietario tiene la PWA instalada
- [ ] Al menos 1 vendedor creado con la PWA instalada
- [ ] (Opcional) Administrador creado con la PWA instalada
- [ ] Todo el equipo sabe cómo acceder a la app
- [ ] Se explicó la diferencia entre roles

---

## 🎉 ¡Todo Listo!

Si completaste todos los checkpoints arriba:
- ✅ Tu PWA está instalada correctamente
- ✅ Funciona como app nativa
- ✅ El equipo puede comenzar a usarla
- ✅ Está lista para uso en producción

**Próximos pasos:**
1. Comienza a registrar pedidos reales
2. Familiariza al equipo con todas las funciones
3. Personaliza los iconos con tu logo oficial
4. Configura recordatorios y flujos de trabajo

---

## 📞 Recursos Adicionales

- **Guía de Instalación Completa:** [INSTALACION_PWA.md](INSTALACION_PWA.md)
- **Características PWA:** [PWA_FEATURES.md](PWA_FEATURES.md)
- **Configuración General:** [SETUP.md](SETUP.md)
- **Sistema de Roles:** [PERMISOS_Y_ROLES.md](PERMISOS_Y_ROLES.md)

**¿Necesitas ayuda?** Revisa la documentación o consulta los logs de error en Chrome DevTools.
