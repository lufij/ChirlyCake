# 🎨 Personalización de la PWA

## Cómo Personalizar tu App de Pastelería

### 🎯 Archivos a Modificar

---

## 1. 📝 Nombre de la Aplicación

**Archivo:** `/public/manifest.json`

```json
{
  "name": "Pastelería Pro - Sistema de Gestión",  // Nombre completo
  "short_name": "Pastelería",  // Nombre en pantalla de inicio (máx 12 caracteres)
  "description": "Sistema integral de gestión para pastelería"
}
```

**Ejemplos:**
- `"short_name": "Dulce Arte"` → Para "Pastelería Dulce Arte"
- `"short_name": "La Reina"` → Para "Pastelería La Reina"
- `"short_name": "Sabor"` → Para "Sabor Artesanal"

---

## 2. 🎨 Colores de la App

**Archivo:** `/public/manifest.json`

```json
{
  "background_color": "#ffffff",  // Color de fondo al abrir
  "theme_color": "#ec4899"  // Color de la barra de estado (Android)
}
```

**Colores de Pastelería Populares:**

### Rosado (actual)
```json
"theme_color": "#ec4899"  // Rosa vibrante
```

### Otros Colores Sugeridos
```json
// Rosa suave
"theme_color": "#f472b6"

// Morado
"theme_color": "#a855f7"

// Azul
"theme_color": "#3b82f6"

// Verde menta
"theme_color": "#10b981"

// Naranja cálido
"theme_color": "#f97316"

// Rojo pastel
"theme_color": "#f43f5e"
```

**También actualiza en:** `/components/PWAHead.tsx`
```typescript
themeColorMeta.content = '#ec4899';  // Cambia este color
```

---

## 3. 🖼️ Iconos de la Aplicación

### Opción A: Usar tus Propios Iconos

1. **Crea un logo cuadrado** (mínimo 512x512 px)
2. **Genera todos los tamaños** en https://www.pwabuilder.com/imageGenerator
3. **Guarda en** `/public/icons/` con estos nombres:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

### Opción B: Iconos Placeholder Personalizados

Edita `/public/icons/generate-placeholder-icons.html` para cambiar:

**Color de fondo del icono:**
```javascript
// Línea ~70
ctx.fillStyle = '#ec4899';  // Cambia el color aquí
```

**Recomendaciones de Diseño:**
- ✅ Fondo sólido de color
- ✅ Logo/símbolo centrado y simple
- ✅ Buen contraste (claro sobre oscuro o viceversa)
- ❌ Evitar texto pequeño
- ❌ Evitar detalles muy finos

---

## 4. 🚀 Splash Screen (Pantalla de Carga)

La pantalla de carga automáticamente usa:
- El icono más grande (512x512)
- El `background_color` del manifest
- El nombre de la app

**Para cambiar:**
- Modifica `background_color` en manifest.json
- Asegúrate que tu icono se vea bien sobre ese fondo

---

## 5. 🔔 Título en la Barra de Tareas (iOS)

**Archivo:** `/components/PWAHead.tsx`

```typescript
appleTitleMeta.content = 'Pastelería';  // Cambia aquí
```

---

## 6. 📱 Orientación de Pantalla

**Archivo:** `/public/manifest.json`

```json
{
  "orientation": "portrait-primary"  // Vertical
}
```

**Opciones:**
- `"portrait-primary"` → Solo vertical (recomendado para tablets)
- `"landscape-primary"` → Solo horizontal
- `"any"` → Permite rotar

---

## 7. 🌐 Idioma

**Archivo:** `/public/manifest.json`

```json
{
  "lang": "es-ES",  // Español (España)
  "dir": "ltr"  // Dirección del texto (left-to-right)
}
```

**Otros idiomas:**
- `"es-MX"` → Español (México)
- `"es-AR"` → Español (Argentina)
- `"en-US"` → Inglés

---

## 8. 🎭 Categoría de la App

**Archivo:** `/public/manifest.json`

```json
{
  "categories": ["business", "productivity"]
}
```

**Opciones relevantes:**
- `"business"` → Negocios
- `"productivity"` → Productividad
- `"food"` → Comida
- `"lifestyle"` → Estilo de vida

---

## 🎨 Ejemplo de Personalización Completa

### Pastelería "Dulce Encanto"

**`/public/manifest.json`:**
```json
{
  "name": "Dulce Encanto - Gestión de Pedidos",
  "short_name": "Dulce Encanto",
  "description": "Sistema de gestión para Pastelería Dulce Encanto",
  "theme_color": "#f472b6",
  "background_color": "#fdf2f8",
  "orientation": "portrait-primary",
  "lang": "es-MX"
}
```

**`/components/PWAHead.tsx`:**
```typescript
themeColorMeta.content = '#f472b6';
appleTitleMeta.content = 'Dulce Encanto';
```

---

## 📊 Cambios que Requieren Reinstalación

Después de modificar estos archivos, los usuarios deben:

### Cambios Automáticos (no requieren reinstalar):
- ✅ Código de la aplicación
- ✅ Estilos CSS
- ✅ Lógica de negocio

### Cambios que SI requieren reinstalar:
- ⚠️ Nombre de la app
- ⚠️ Iconos
- ⚠️ Colores del manifest
- ⚠️ Orientación de pantalla

**Cómo actualizar:**
1. Desinstala la PWA de la pantalla de inicio
2. Limpia caché de Chrome
3. Vuelve a instalar desde el navegador

---

## 💡 Tips de Diseño

### Para Iconos:
1. **Simplicidad:** Un símbolo simple es más reconocible
2. **Contraste:** Asegura que se vea en fondos claros y oscuros
3. **Escalabilidad:** Debe verse bien de 72x72 hasta 512x512
4. **Brand:** Usa los colores de tu marca

### Para Colores:
1. **Coherencia:** Usa el color principal de tu marca
2. **Psicología:** Rosa = dulce, Morado = premium, Verde = natural
3. **Legibilidad:** Evita colores muy claros para la barra de estado
4. **Testing:** Prueba en diferentes dispositivos

### Para Nombres:
1. **Corto:** Máximo 12 caracteres para `short_name`
2. **Memorable:** Fácil de recordar y pronunciar
3. **Descriptivo:** Que indique qué hace la app (ej: "Mi Pastelería")
4. **Sin caracteres especiales:** Evita emojis en el nombre oficial

---

## 🔧 Herramientas Útiles

### Generadores de Iconos:
- **PWA Builder:** https://www.pwabuilder.com/imageGenerator
- **RealFaviconGenerator:** https://realfavicongenerator.net/
- **App Icon Generator:** https://appicon.co/

### Paletas de Colores:
- **Coolors:** https://coolors.co/
- **Adobe Color:** https://color.adobe.com/
- **Material Design Colors:** https://materialui.co/colors

### Testing PWA:
- **Lighthouse** (Chrome DevTools)
- **PWA Builder:** https://www.pwabuilder.com/
- **Web.dev:** https://web.dev/measure/

---

## ✅ Checklist de Personalización

- [ ] Cambiar nombre en manifest.json
- [ ] Cambiar short_name (máx 12 caracteres)
- [ ] Actualizar theme_color
- [ ] Actualizar background_color
- [ ] Crear/subir iconos personalizados (8 tamaños)
- [ ] Actualizar título en PWAHead.tsx
- [ ] Cambiar descripción
- [ ] Verificar idioma/región
- [ ] Probar en dispositivo real
- [ ] Reinstalar PWA para ver cambios

---

## 🎉 Resultado Final

Una vez personalizada, tu PWA tendrá:
- ✅ Nombre de tu pastelería
- ✅ Logo oficial en todos los tamaños
- ✅ Colores de tu marca
- ✅ Apariencia profesional y única
- ✅ Identidad visual coherente

**¡Tu aplicación reflejará perfectamente la identidad de tu pastelería! 🎂**
