# 📱 Guía de Instalación PWA en Tabletas Sunmi

## ✅ Paso 1: Preparar la Aplicación

La aplicación ya está configurada como PWA. Solo necesitas:

### Agregar Iconos (Opcional pero Recomendado)
1. Ve a la carpeta `/public/icons/`
2. Sigue las instrucciones en `ICON_INSTRUCTIONS.md`
3. Coloca tus iconos personalizados o usa temporalmente placeholders

---

## 📲 Paso 2: Instalar en Tableta Sunmi

### Método A: Instalación Automática (Recomendado)

1. **Abre Chrome** en tu tableta Sunmi
2. **Accede a la URL** de tu aplicación deployada
3. **Espera el prompt de instalación**
   - Aparecerá una tarjeta en la parte inferior con el botón "Instalar"
   - Si no aparece automáticamente, ve al Método B

4. **Presiona "Instalar"**
   - La app se agregará a la pantalla de inicio
   - Tendrá su propio icono
   - Se abrirá en modo standalone (pantalla completa sin barra de navegador)

### Método B: Instalación Manual

1. **Abre Chrome** en la tableta
2. **Ve a la URL** de la aplicación
3. **Toca el menú** (los tres puntos ⋮ en la esquina superior derecha)
4. **Selecciona "Agregar a pantalla de inicio"** o "Instalar app"
5. **Confirma** el nombre y presiona "Agregar"

---

## 🎯 Paso 3: Configurar para Uso en Taller/Cocina

### Configuraciones Recomendadas en Sunmi:

#### A) Mantener Pantalla Encendida
1. Ve a **Ajustes** → **Pantalla**
2. Configura **Tiempo de espera** → "Nunca" o "30 minutos"
3. Activa **Mantener pantalla activa mientras se carga**

#### B) Brillo Automático
1. Ve a **Ajustes** → **Pantalla**
2. Activa **Brillo automático**
3. O configura brillo alto fijo para ambientes con mucha luz

#### C) Modo Kiosk (Opcional - Para Bloquear la Tableta en la App)
Si quieres que la tableta solo muestre tu aplicación:

1. **Opción 1: Usar App Kiosk**
   - Descarga "Kiosk Browser Lockdown" o similar de Play Store
   - Configura la URL de tu aplicación
   - Activa modo kiosk

2. **Opción 2: Configuración Manual Android**
   - Ve a **Ajustes** → **Seguridad** → **Fijar aplicación**
   - Activa la función
   - Abre la PWA instalada
   - Presiona el botón de apps recientes
   - Toca el ícono de la app y selecciona "Fijar"

#### D) Desactivar Notificaciones Innecesarias
1. Ve a **Ajustes** → **Notificaciones**
2. Desactiva notificaciones de apps no esenciales
3. Mantén solo las de tu aplicación de pastelería

---

## 🔄 Actualizaciones de la PWA

### La PWA se actualiza automáticamente:
- ✅ Cuando hay conexión a internet
- ✅ Al abrir la aplicación
- ✅ El service worker descarga la nueva versión en segundo plano
- ✅ La próxima vez que abras, tendrás la última versión

### Forzar Actualización Manual:
1. Cierra completamente la app (desliza desde apps recientes)
2. Abre nuevamente
3. O limpia caché: Chrome → Ajustes → Privacidad → Borrar datos → Solo caché

---

## 🌐 Funcionamiento Offline

### Qué funciona sin internet:
- ✅ Interfaz de la aplicación
- ✅ Navegación entre secciones
- ✅ Visualización de datos cargados previamente
- ⚠️ Creación/edición de pedidos (se sincroniza cuando haya conexión)

### Qué requiere internet:
- 🔌 Sincronización con el servidor
- 🔌 Guardar nuevos pedidos
- 🔌 Cargar pedidos nuevos de otros usuarios
- 🔌 Subir imágenes

---

## 🔧 Solución de Problemas

### "No aparece el botón de instalar"
**Posibles causas:**
1. Ya está instalada (revisa pantalla de inicio)
2. Navegador no compatible (usa Chrome)
3. No estás en HTTPS (la PWA requiere conexión segura)

**Solución:** Usa el Método B de instalación manual

### "La app no abre/pantalla en blanco"
**Solución:**
1. Verifica conexión a internet
2. Limpia caché del navegador
3. Desinstala y reinstala la PWA
4. Revisa que la URL esté accesible

### "No se actualiza la aplicación"
**Solución:**
1. Cierra completamente la app
2. Abre Chrome → Ajustes → Privacidad → Borrar caché
3. Vuelve a abrir la PWA

### "Funciona lento"
**Solución:**
1. Verifica calidad de conexión WiFi/4G
2. Reinicia la tableta Sunmi
3. Libera memoria cerrando apps en segundo plano

---

## 📊 Verificar que la PWA Funciona Correctamente

### Checklist de Prueba:
- [ ] La app tiene su propio icono en pantalla de inicio
- [ ] Se abre sin mostrar la barra de direcciones de Chrome
- [ ] Funciona en orientación vertical (portrait)
- [ ] Se puede navegar entre todas las secciones
- [ ] Aparece el splash screen al abrir (pantalla de carga)
- [ ] Se pueden crear y editar pedidos
- [ ] Las imágenes se cargan correctamente
- [ ] El calendario muestra los pedidos

---

## 🎨 Personalización Adicional

### Cambiar Color de la Barra de Estado
Edita `/public/manifest.json`:
```json
"theme_color": "#ec4899"  // Cambia este color
```

### Cambiar Nombre de la App en Pantalla de Inicio
Edita `/public/manifest.json`:
```json
"short_name": "Pastelería"  // Máx 12 caracteres
```

---

## 📞 Soporte

Si tienes problemas con la instalación o funcionamiento:
1. Verifica que tu tableta Sunmi tenga Android 7.0 o superior
2. Asegúrate de usar Chrome actualizado
3. Verifica que la URL esté accesible desde la red de la tableta
4. Revisa los logs en Chrome DevTools si es necesario

---

## ✨ Próximos Pasos

Una vez instalada la PWA:
1. ✅ Configura el usuario propietario (si es primera vez)
2. ✅ Crea usuarios adicionales (vendedores, administrador)
3. ✅ Comienza a registrar pedidos
4. ✅ Configura recordatorios y notificaciones
5. ✅ Familiarízate con todas las funciones

---

**¡Tu sistema de gestión de pastelería está listo para usar en las tabletas Sunmi! 🎂**
