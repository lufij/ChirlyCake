# 🧪 Cómo Probar el Formulario Público

## 🚀 Método Rápido (Recomendado)

### Paso 1: Abre la Aplicación
Navega a tu aplicación:
```
http://localhost:5173
```

### Paso 2: Inicia Sesión
Usa tus credenciales de propietario/administrador/vendedor

### Paso 3: Click en "Link de Pedidos"
- En el **header** (parte superior derecha)
- Busca el botón **morado** con ícono de compartir
- Dice "Link de Pedidos" (en desktop) o solo muestra el ícono (en móvil)

### Paso 4: Click en "Ir Ahora"
En el diálogo que aparece:
- Verás 3 botones
- Haz click en el botón **morado** que dice **"Ir Ahora"** 🎂
- Esto te llevará directamente al formulario

---

## 🔗 Método Directo (URL)

### Opción A: URL Completa
Escribe en la barra del navegador:
```
http://localhost:5173/pedido
```

### Opción B: En Producción
```
https://tu-dominio.com/pedido
```

**⚠️ IMPORTANTE:** NO uses la almohadilla (#):
- ❌ `http://localhost:5173/#/pedido`
- ✅ `http://localhost:5173/pedido`

---

## 🧪 Qué Deberías Ver

### Componente de Prueba (Actualmente Activo)

Si ves esto, **TODO ESTÁ FUNCIONANDO** ✅:

```
┌────────────────────────────────────────┐
│  🎂 Formulario de Pedidos              │
│                                        │
│  Este es un componente de prueba...   │
│                                        │
│  ✅ Si ves este mensaje, significa    │
│  que:                                  │
│  • La ruta /pedido está funcionando   │
│  • El componente se está renderizando │
│  • El sistema de routing está OK      │
│                                        │
│  Ruta actual: /pedido                 │
│  Origen: http://localhost:5173        │
└────────────────────────────────────────┘
```

### Formulario Real (Próximo Paso)

Una vez confirmado que el test funciona, verás:

```
┌────────────────────────────────────────┐
│         🎂                             │
│    Haz tu Pedido                       │
│  Completa el formulario y nos          │
│  pondremos en contacto contigo         │
│                                        │
│  TUS DATOS                            │
│  ┌──────────────────────────┐         │
│  │ Nombre *                 │         │
│  └──────────────────────────┘         │
│  ┌──────────────────────────┐         │
│  │ Apellido                 │         │
│  └──────────────────────────┘         │
│  ┌──────────────────────────┐         │
│  │ Teléfono/WhatsApp *      │         │
│  └──────────────────────────┘         │
│                                        │
│  TIPO DE PASTEL                       │
│  [Turrón] [Betún] [Fondant]           │
│                                        │
│  TAMAÑO                               │
│  [5] [10] [15] [20] [25]...          │
│                                        │
│  ... más campos ...                   │
│                                        │
│  [ Enviar Pedido por WhatsApp ]       │
└────────────────────────────────────────┘
```

---

## ✅ Checklist de Prueba

### 1. Acceso Básico
- [ ] La URL `/pedido` carga sin errores
- [ ] No aparece "Not Found"
- [ ] No hay errores en consola (F12)

### 2. Componente de Prueba
- [ ] Se ve el mensaje "🎂 Formulario de Pedidos"
- [ ] Muestra el checkmark verde ✅
- [ ] Aparece la ruta actual correcta

### 3. Navegación
- [ ] El botón "Link de Pedidos" aparece en el Dashboard
- [ ] El diálogo se abre correctamente
- [ ] Los 3 botones funcionan:
  - [ ] "Copiar" - copia el link
  - [ ] "Nueva Tab" - abre en pestaña nueva
  - [ ] "Ir Ahora" - navega al formulario

### 4. Formulario Real (después de activarlo)
- [ ] Se muestran los 3 tipos de pastel con imágenes
- [ ] Los botones de tamaño son clickeables
- [ ] El calendario se abre
- [ ] Se pueden subir imágenes
- [ ] El botón de envío funciona

---

## 🔄 Cómo Activar el Formulario Real

Una vez que confirmes que el componente de prueba funciona:

### Paso 1: Abre App.tsx
Busca el archivo `/App.tsx`

### Paso 2: Encuentra la línea 105
Verás esto:
```tsx
<TestPublicForm />
```

### Paso 3: Cambia por PublicOrderForm
Reemplaza con:
```tsx
<PublicOrderForm />
```

### Paso 4: Guarda y Recarga
- Guarda el archivo (`Ctrl + S`)
- El navegador debería recargar automáticamente
- Navega nuevamente a `/pedido`

---

## 🐛 Si Ves "Not Found"

### Abre la Consola (F12)

#### Busca logs:
Deberías ver en la consola:
```
App mounted, current path: /pedido
Rendering PublicOrderForm for path: /pedido
TestPublicForm rendered successfully!
```

#### Si NO ves estos mensajes:
1. El componente tiene un error de importación
2. Revisa errores en rojo en la consola
3. Consulta `SOLUCION_PROBLEMAS_FORMULARIO.md`

---

## 📱 Prueba en Móvil

### Usando ngrok o similar:
```bash
ngrok http 5173
```

Luego accede desde tu móvil:
```
https://xxxx.ngrok.io/pedido
```

### O en la misma red:
```
http://TU-IP-LOCAL:5173/pedido
```

Ejemplo:
```
http://192.168.1.100:5173/pedido
```

---

## 🎯 Prueba Completa del Flujo

### Test del Formulario Real

1. **Llenar Datos**
   - Nombre: "Juan"
   - Teléfono: "5551234567"
   
2. **Seleccionar Pastel**
   - Click en "Betún"
   - Click en tamaño "20"
   
3. **Detalles**
   - Decoración: "Flores y mariposas"
   - Color: "Rosa y blanco"
   - Sabor: "Vainilla"

4. **Fecha**
   - Click en el calendario
   - Selecciona una fecha futura
   - Hora: "15:00"

5. **Fotos** (opcional)
   - Click en área de upload
   - Sube 1-2 imágenes de prueba

6. **Enviar**
   - Click en "Enviar Pedido por WhatsApp"
   - Debería abrir WhatsApp con mensaje pre-lleno
   - Debería mostrar pantalla de éxito

7. **Verificar en Dashboard**
   - Vuelve al Dashboard
   - Ve a "Pedidos"
   - Busca el pedido con badge **"🎂 Pedido Público"**
   - Estado: "Pendiente Confirmación"

---

## 📊 Resultados Esperados

### ✅ Éxito Total
- Componente de prueba se muestra
- Formulario real carga sin errores
- Se pueden llenar todos los campos
- El envío funciona
- El pedido aparece en el Dashboard
- WhatsApp se abre con el mensaje

### ⚠️ Éxito Parcial
- Componente de prueba funciona
- Formulario real tiene errores menores
- Algunos campos no funcionan
- → Revisar consola para errores específicos

### ❌ Fallo
- "Not Found" aparece
- No se muestra ningún componente
- Consola llena de errores rojos
- → Consultar `SOLUCION_PROBLEMAS_FORMULARIO.md`

---

## 💡 Tips de Testing

### Debug Rápido
- Siempre mantén la consola abierta (F12)
- Prueba en modo incógnito para evitar caché
- Usa `console.log` liberalmente

### Comparación de Componentes
```tsx
// Prueba 1: Componente simple
<TestPublicForm />  // ✅ Debería funcionar siempre

// Prueba 2: Formulario real
<PublicOrderForm /> // ✅ Debería funcionar después de verificar dependencias
```

### Logs Importantes
En la consola, busca:
```
✅ "App mounted, current path: /pedido"
✅ "Rendering PublicOrderForm for path: /pedido"
✅ "TestPublicForm rendered successfully!"
✅ "PublicOrderForm component loaded"
✅ "PublicOrderForm rendering"
```

---

## 🆘 Última Opción

Si **NADA** funciona:

### Hard Reset
```bash
# Detén el servidor (Ctrl + C)

# Limpia node_modules
rm -rf node_modules
rm package-lock.json

# Reinstala
npm install

# Reinicia
npm run dev
```

### Verifica package.json
Asegúrate de que tienes:
```json
{
  "dependencies": {
    "react": "^18.x.x",
    "lucide-react": "latest",
    "date-fns": "latest",
    "sonner": "latest"
  }
}
```

---

## 📞 Información para Reportar Problemas

Si necesitas ayuda, proporciona:

1. **Screenshot** de lo que ves
2. **Errores de consola** (F12 → Console)
3. **URL exacta** que estás usando
4. **Navegador y versión**
5. **Pasos que seguiste**

Esto ayudará a diagnosticar rápidamente el problema.

---

## ✨ Próximos Pasos

Una vez que todo funcione:

1. ✅ Confirmar que TestPublicForm se muestra
2. ✅ Activar PublicOrderForm
3. ✅ Probar envío completo
4. ✅ Verificar en Dashboard
5. ✅ Compartir link con clientes reales
6. 🎉 ¡Disfrutar de pedidos automáticos!
