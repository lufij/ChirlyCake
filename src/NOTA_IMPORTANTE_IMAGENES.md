# ⚠️ NOTA IMPORTANTE SOBRE LAS IMÁGENES

## 🖼️ Problema con las importaciones de Figma

El componente `PublicOrderForm.tsx` actualmente usa imágenes con el formato `figma:asset`:

```typescript
import turronImage from 'figma:asset/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
import fondantImage from 'figma:asset/0546f288cc45540200ba187c6f98e672c890ef6c.png';
import betunImage from 'figma:asset/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';
```

**Este formato SOLO funciona en el entorno de Figma Make y NO funcionará en Vercel.**

## ✅ Solución

Necesitas hacer UNA de estas dos cosas:

### Opción 1: Usar imágenes desde URLs públicas (Más rápido)

Edita `components/PublicOrderForm.tsx` y reemplaza las 3 líneas de import por:

```typescript
const turronImage = 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800';
const fondantImage = 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800';
const betunImage = 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800';
```

### Opción 2: Usar imágenes locales (Recomendado)

1. **Descarga o toma 3 fotos de pasteles:**
   - Una con cobertura de turrón/merengue
   - Una con cobertura de betún/crema
   - Una con cobertura de fondant

2. **Guárdalas en `public/images/`:**
   - `public/images/turron.jpg`
   - `public/images/betun.jpg`
   - `public/images/fondant.jpg`

3. **Edita `components/PublicOrderForm.tsx`:**

   Busca estas líneas (cerca de la línea 10):
   ```typescript
   import turronImage from 'figma:asset/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
   import fondantImage from 'figma:asset/0546f288cc45540200ba187c6f98e672c890ef6c.png';
   import betunImage from 'figma:asset/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';
   ```

   Reemplázalas por:
   ```typescript
   import turronImage from '/images/turron.jpg';
   import fondantImage from '/images/fondant.jpg';
   import betunImage from '/images/betun.jpg';
   ```

## 📝 Instrucciones detalladas

### Para Opción 2 (Imágenes locales):

1. **Abre el archivo:**
   - En VS Code, abre `components/PublicOrderForm.tsx`

2. **Encuentra las líneas de importación:**
   - Presiona `Ctrl+F` (o `Cmd+F` en Mac)
   - Busca: `figma:asset`
   - Deberías encontrar 3 líneas

3. **Elimina las 3 líneas:**
   ```typescript
   import turronImage from 'figma:asset/f5fd82509aa844458a9987489ff3dc63ac9314e7.png';
   import fondantImage from 'figma:asset/0546f288cc45540200ba187c6f98e672c890ef6c.png';
   import betunImage from 'figma:asset/d9437422728e1c5a0ff4c628c8a3f11c480e7d8f.png';
   ```

4. **Agrega estas 3 líneas en su lugar:**
   ```typescript
   import turronImage from '/images/turron.jpg';
   import fondantImage from '/images/fondant.jpg';
   import betunImage from '/images/betun.jpg';
   ```

5. **Guarda el archivo:**
   - `Ctrl+S` (o `Cmd+S` en Mac)

## ✅ Verificación

Después de hacer el cambio:

1. **En desarrollo local:**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000/#/pedido
   
   Las 3 imágenes deberían verse correctamente

2. **Antes de deployment:**
   ```bash
   npm run build
   ```
   
   Si hay errores de importación, las imágenes no están bien configuradas

## 🚨 ¿Por qué es importante?

Si no haces este cambio:
- ❌ El build de Vite fallará
- ❌ Vercel no podrá desplegar tu aplicación
- ❌ O se desplegará pero sin las imágenes (mostrará errores 404)

## 📸 ¿Dónde conseguir las imágenes?

### Opción A: Fotos propias
- Toma fotos de pasteles reales de tu pastelería
- Mejor para tu marca

### Opción B: Stock gratuito
- Unsplash: https://unsplash.com/s/photos/cake
- Pexels: https://www.pexels.com/search/cake/
- Pixabay: https://pixabay.com/images/search/cake/

### Opción C: Descargar las actuales
Si tienes acceso al entorno de Figma Make donde están las imágenes actuales:
1. Abre el formulario público
2. Click derecho en cada imagen → "Guardar imagen como..."
3. Guárdalas con los nombres correctos

## 📐 Especificaciones de las imágenes

- **Formato**: JPG o PNG
- **Tamaño**: Mínimo 400x400px, recomendado 800x800px
- **Aspecto**: Cuadrado (1:1)
- **Peso**: Máximo 500KB cada una (para velocidad)
- **Calidad**: Alta pero optimizada para web

## 🔧 Herramientas para optimizar imágenes

Si tus fotos son muy grandes:
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim (Mac): https://imageoptim.com/

## ✨ Resultado final

Después de este cambio, tu carpeta debería verse así:

```
public/
├── images/
│   ├── turron.jpg    ← Tu imagen
│   ├── betun.jpg     ← Tu imagen
│   └── fondant.jpg   ← Tu imagen
├── icons/
│   └── ... (8 iconos PNG)
└── manifest.json
```

Y tu código en `PublicOrderForm.tsx`:
```typescript
import turronImage from '/images/turron.jpg';
import fondantImage from '/images/fondant.jpg';
import betunImage from '/images/betun.jpg';
```

---

**¡Listo!** Después de este cambio, tu aplicación estará lista para production deployment en Vercel. 🚀
