# 🔧 Solución de Problemas - Formulario Público

## Problema: "Not Found" al acceder a /pedido

### ✅ Pasos para Solucionar

#### 1. Verifica la URL
Asegúrate de que estés accediendo a:
```
http://localhost:5173/pedido
```
o
```
https://tu-dominio.com/pedido
```

**NO debe tener** la almohadilla `#`:
- ❌ `http://localhost:5173/#/pedido`
- ✅ `http://localhost:5173/pedido`

#### 2. Abre la Consola del Navegador
1. Presiona `F12` o clic derecho → "Inspeccionar"
2. Ve a la pestaña **Console**
3. Busca estos mensajes:
   ```
   App mounted, current path: /pedido
   Rendering PublicOrderForm for path: /pedido
   PublicOrderForm component loaded
   PublicOrderForm rendering
   ```

#### 3. Si ves "Not Found"
Significa que el componente tiene un error. Verifica:

**A. Errores en la consola**
- Busca mensajes en rojo
- Los errores más comunes:
  - `Cannot find module` - Falta alguna importación
  - `Unexpected token` - Error de sintaxis
  - `is not a function` - Función mal importada

**B. Componente de Prueba**
Temporalmente hemos activado un componente de prueba simple (`TestPublicForm`).
Si ves este componente, significa que:
- ✅ La ruta está funcionando
- ✅ El routing está correcto
- ❌ El problema está en PublicOrderForm

#### 4. Prueba desde el Dashboard

1. Inicia sesión en la app
2. En el header, busca el botón **"Link de Pedidos"** (morado con ícono de compartir)
3. Haz clic en el botón
4. En el diálogo que aparece, tienes 3 opciones:
   - **Copiar** - Copia el link al portapapeles
   - **Nueva Tab** - Abre el formulario en nueva pestaña
   - **Ir Ahora** - Navega directamente al formulario (⭐ recomendado para testing)

#### 5. Verifica el Backend

El formulario necesita el endpoint `/public-order` funcionando.

Prueba manualmente:
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-95aa99a4/public-order \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test",
      "phone": "1234567890"
    },
    "order": {
      "type": "turron",
      "size": "10 personas",
      "deliveryDate": "2025-11-15"
    }
  }'
```

Deberías recibir:
```json
{
  "success": true,
  "order": { ... }
}
```

### 🐛 Debugging Avanzado

#### Componente Simple de Prueba
Hemos creado `TestPublicForm.tsx` que:
- ✅ No tiene dependencias complejas
- ✅ Muestra información de la ruta
- ✅ Confirma que el routing funciona

Para activarlo (ya está activado):
- El `App.tsx` usa `<TestPublicForm />` en lugar de `<PublicOrderForm />`
- Una vez que confirmes que funciona, cambiaremos a `PublicOrderForm`

#### Restaurar el Formulario Real

Una vez que veas el componente de prueba funcionando:

1. Abre `/App.tsx`
2. Busca la línea 105:
   ```tsx
   <TestPublicForm />
   ```
3. Cámbiala por:
   ```tsx
   <PublicOrderForm />
   ```
4. Guarda el archivo

### 📋 Checklist de Verificación

- [ ] La URL es `/pedido` (sin #)
- [ ] No hay errores en la consola
- [ ] El componente de prueba se muestra correctamente
- [ ] El backend responde en `/public-order`
- [ ] Las imágenes de Unsplash se cargan
- [ ] El botón "Link de Pedidos" aparece en el Dashboard

### 🔍 Errores Comunes y Soluciones

#### Error: "Cannot resolve './ui/utils'"
**Solución:**
```tsx
// Cambiar
import { cn } from './ui/utils';
// Por
import { cn } from '../components/ui/utils';
```

#### Error: "date-fns/locale not found"
**Solución:**
```tsx
// Asegúrate de que la importación sea:
import { es } from 'date-fns/locale';
```

#### Error: "Popover is not defined"
**Solución:**
El componente Popover debe existir en `/components/ui/popover.tsx`

#### Error: "ImageWithFallback not found"
**Solución:**
Verifica que existe `/components/figma/ImageWithFallback.tsx`

### 🎯 Próximos Pasos

Una vez que el componente de prueba funcione:

1. **Activar PublicOrderForm**: Cambiar `<TestPublicForm />` por `<PublicOrderForm />`
2. **Verificar Imágenes**: Las imágenes de Unsplash deben cargar
3. **Probar Envío**: Completar el formulario y enviarlo
4. **Verificar en Dashboard**: El pedido debe aparecer con badge púrpura

### 💡 Tips

- Usa el botón **"Ir Ahora"** del diálogo para testing rápido
- Mantén la consola abierta siempre
- Prueba en modo incógnito para descartar problemas de caché
- Si nada funciona, recarga la página con `Ctrl + Shift + R` (hard reload)

### 🆘 Si Nada Funciona

1. **Limpia el caché**:
   - Chrome: `Ctrl + Shift + Delete`
   - Marca "Cached images and files"
   - Click "Clear data"

2. **Reinicia el servidor de desarrollo**:
   ```bash
   # Detén el servidor (Ctrl + C)
   # Vuelve a iniciarlo
   npm run dev
   ```

3. **Verifica las dependencias**:
   ```bash
   npm install
   ```

4. **Última opción - Hard Reset**:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

## 📞 Información de Debug

Cuando necesites ayuda, comparte:

1. **URL exacta** que estás usando
2. **Errores de consola** (captura de pantalla)
3. **Comportamiento observado** vs **esperado**
4. **Navegador y versión** (Chrome 120, Firefox 121, etc.)
5. **Mensaje que aparece** (exactamente como aparece)

Esto ayudará a diagnosticar el problema rápidamente.
