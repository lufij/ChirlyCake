# ❓ Preguntas Frecuentes - PWA Pastelería

## 📱 Instalación y Uso

### ¿Cómo instalo la PWA en mi tableta Sunmi?
1. Abre Chrome en tu tableta
2. Ve a la URL de tu aplicación
3. Espera el mensaje "Instalar Pastelería Pro"
4. Presiona "Instalar"
5. El icono aparecerá en tu pantalla de inicio

**Detalles:** [INSTALACION_PWA.md](INSTALACION_PWA.md)

---

### ¿Necesito bajarla de Google Play Store?
**No.** La PWA se instala directamente desde el navegador. No necesitas ninguna tienda de apps.

---

### ¿Funciona solo en tabletas Sunmi?
**No.** Funciona en:
- ✅ Tabletas Sunmi (Android)
- ✅ Cualquier tablet Android
- ✅ iPhones y iPads (iOS 16.4+)
- ✅ Smartphones Android
- ✅ Computadoras Windows/Mac/Linux

---

### ¿Puedo instalarla en múltiples dispositivos?
**Sí.** Puedes instalar la PWA en todos los dispositivos que necesites. Todos se sincronizarán con la misma base de datos.

---

### ¿Cómo desinstalo la PWA?
**Android/Sunmi:**
- Mantén presionado el icono → "Desinstalar" o "Eliminar"

**iOS:**
- Mantén presionado el icono → "Eliminar app"

**Desktop:**
- Chrome → Configuración → Apps → Eliminar

---

## 🌐 Conectividad

### ¿Funciona sin internet?
**Parcialmente.** 
- ✅ La interfaz se carga desde cache
- ✅ Puedes ver pedidos previamente cargados
- ✅ Puedes navegar entre secciones
- ❌ No puedes crear/editar pedidos
- ❌ No se sincronizan datos nuevos

---

### ¿Qué pasa si se cae el internet mientras uso la app?
La app sigue funcionando con los datos que ya tenía cargados. Cuando regrese la conexión, se sincronizará automáticamente.

---

### ¿Consume muchos datos móviles?
**No.** Gracias al cache, después de la primera carga consume muy pocos datos. Solo sincroniza cambios nuevos.

**Estimado:**
- Primera carga: ~2-5 MB
- Uso normal diario: ~500 KB - 1 MB
- Con muchas imágenes: +2-5 MB

---

## 🔄 Actualizaciones

### ¿Cómo actualizo la app cuando hay nueva versión?
**Automáticamente.** El service worker descarga actualizaciones en segundo plano. Solo cierra y vuelve a abrir la app.

---

### ¿Tengo que desinstalar y reinstalar para actualizar?
**No.** Las actualizaciones son automáticas. Solo en casos muy raros (cambio de iconos/manifest) necesitarías reinstalar.

---

### ¿Cuánto tarda en actualizarse?
Normalmente al abrir la app por segunda vez después de que se desplegó la actualización (segundos/minutos).

---

## 🎨 Personalización

### ¿Puedo cambiar el icono de la app?
**Sí.** Crea tus iconos personalizados y colócalos en `/public/icons/`. Luego reinstala la PWA.

**Guía:** [PWA_CUSTOMIZATION.md](PWA_CUSTOMIZATION.md)

---

### ¿Puedo cambiar el nombre que aparece en pantalla?
**Sí.** Edita `short_name` en `/public/manifest.json`. Máximo 12 caracteres.

---

### ¿Puedo cambiar los colores?
**Sí.** Edita `theme_color` en `/public/manifest.json` y en `/components/PWAHead.tsx`.

---

## 🔐 Seguridad

### ¿Es segura una PWA?
**Sí.** Las PWA requieren HTTPS, lo que garantiza:
- ✅ Comunicación encriptada
- ✅ Datos protegidos
- ✅ No hay interceptación de información
- ✅ Misma seguridad que apps nativas

---

### ¿Mis datos están seguros en el cache?
**Sí.** El cache está aislado por dominio y solo tu app puede acceder a él. Se elimina completamente al desinstalar la PWA.

---

### ¿Qué pasa si alguien roba mi tableta?
Los datos en cache son de solo lectura. Para modificar algo en el servidor necesitan autenticarse con usuario y contraseña.

---

## 💾 Almacenamiento

### ¿Cuánto espacio ocupa la PWA en mi tableta?
**Muy poco.** Normalmente:
- Cache base: ~10-20 MB
- Datos e imágenes: Variable según uso
- Total típico: ~30-50 MB

Mucho menos que una app nativa equivalente (que serían 50-100 MB).

---

### ¿Se llena la memoria de la tableta con el cache?
**No.** El navegador gestiona automáticamente el espacio. Si se llena, elimina cache antiguo de otras apps.

---

### ¿Puedo limpiar el cache manualmente?
**Sí.** Chrome → Configuración → Privacidad → Borrar datos de navegación → Archivos en caché

**Nota:** Esto solo afecta la velocidad, no los datos (esos están en el servidor).

---

## 🔧 Problemas Técnicos

### No aparece el botón "Instalar"
**Posibles causas:**
- Ya está instalada (revisa pantalla de inicio)
- No estás en HTTPS
- El navegador no es Chrome

**Solución:** Usa instalación manual → Menú (⋮) → "Agregar a pantalla de inicio"

---

### La app muestra pantalla blanca
**Posibles causas:**
- No hay conexión a internet
- URL incorrecta
- Error en el service worker

**Solución:**
1. Verifica conexión a internet
2. Verifica que la URL es correcta
3. Desinstala y reinstala la PWA
4. Revisa Chrome DevTools para errores

---

### Los iconos se ven genéricos (logo de Chrome)
**Causa:** Los archivos de iconos no están en `/public/icons/`

**Solución:**
1. Genera los iconos con el generador incluido
2. Súbelos a `/public/icons/`
3. Redeploy la aplicación
4. Desinstala y reinstala la PWA

---

### La app no actualiza cuando hago cambios
**Solución:**
1. Cierra COMPLETAMENTE la app (desliza desde apps recientes)
2. Espera 10 segundos
3. Vuelve a abrir
4. Si persiste, limpia caché de Chrome

---

### No puedo crear pedidos
**Verifica:**
- ¿Hay conexión a internet?
- ¿La URL del servidor es correcta?
- ¿Estás autenticado (no se cerró tu sesión)?

---

## 📊 Comparación

### ¿Cuál es la diferencia entre PWA y app nativa?

| Aspecto | PWA | App Nativa |
|---------|-----|------------|
| Instalación | Directa desde navegador | Desde app store |
| Tamaño | 10-50 MB | 50-150 MB |
| Actualizaciones | Automáticas instantáneas | Manual desde store |
| Costo desarrollo | Bajo (un código) | Alto (iOS + Android) |
| Offline | Parcial | Completa |
| Performance | Muy buena | Excelente |
| Acceso hardware | Limitado | Completo |

**Para gestión de pastelería, PWA es más que suficiente.**

---

### ¿Es mejor que una app web normal?
**Sí.** Ventajas de PWA vs web app:
- ✅ Icono en pantalla de inicio
- ✅ Pantalla completa (sin barra de Chrome)
- ✅ Funciona parcialmente offline
- ✅ Más rápida (cache)
- ✅ Se siente como app nativa

---

### ¿Por qué no crear una app nativa?
**Costos y tiempo:**
- App nativa: $5,000-$20,000 USD + 2-6 meses
- PWA: Incluida + 10 minutos de configuración

**Mantenimiento:**
- App nativa: Actualizar iOS y Android por separado
- PWA: Un solo deploy para todos

---

## 🎯 Casos de Uso

### ¿Puedo usar la PWA en eventos sin WiFi?
**Sí, pero limitado.** Lleva los datos pre-cargados y usa datos móviles para sincronizar. O consulta pedidos offline y sincroniza después.

---

### ¿Funciona bien con muchas imágenes?
**Sí.** Las imágenes se cargan bajo demanda y se cachean. No afecta el rendimiento general.

---

### ¿Cuántos usuarios simultáneos soporta?
**Ilimitados (depende de Supabase).** La PWA no tiene límite de instalaciones. 10, 100 o 1000 usuarios pueden usarla simultáneamente.

---

## 💰 Costos

### ¿Tiene costo instalar la PWA?
**No.** Es gratis. No hay cargos por instalación, uso o usuarios.

---

### ¿Hay costo por tener la app en tablets?
**No.** Instala en todas las tablets que necesites sin costo adicional.

---

### ¿Hay cargos recurrentes?
Solo los costos normales de tu infraestructura (hosting/Supabase). La PWA no agrega costos adicionales.

---

## 🚀 Performance

### ¿Es más lenta que una app nativa?
**No notablemente.** En uso diario, la diferencia es imperceptible. Para gestión de pastelería, el rendimiento es excelente.

---

### ¿Se puede usar con conexión lenta?
**Sí.** Gracias al cache, funciona muy bien incluso con 3G. Solo la sincronización inicial puede tardar más.

---

### ¿Consume mucha batería?
**No.** Consume lo mismo que usar el navegador. No tiene procesos en segundo plano que consuman batería.

---

## 🔮 Futuro

### ¿Puedo agregar más funcionalidades después?
**Sí.** Puedes agregar:
- Notificaciones push
- Acceso a cámara
- Sincronización background
- Impresión directa (Sunmi)
- Y más...

---

### ¿La PWA seguirá funcionando en el futuro?
**Sí.** PWA es un estándar web soportado por todos los navegadores principales y seguirá mejorando.

---

### ¿Qué pasa si quiero migrar a app nativa después?
El código React actual puede usarse para crear una app nativa con React Native. La arquitectura es compatible.

---

## 📞 Soporte

### ¿Dónde encuentro ayuda?
**Documentación incluida:**
- [Inicio Rápido](QUICK_START_PWA.md)
- [Checklist Completo](PWA_CHECKLIST.md)
- [Solución de Problemas](PWA_CHECKLIST.md#-solución-de-problemas)
- [Guía de Instalación](INSTALACION_PWA.md)

---

### ¿Cómo reporto un error?
1. Abre Chrome DevTools (F12)
2. Ve a pestaña Console
3. Copia el error en rojo
4. Comparte el mensaje de error

---

### ¿Funciona en navegadores que no son Chrome?
**Android:** Chrome, Edge, Samsung Internet, Firefox
**iOS:** Safari, Chrome
**Desktop:** Chrome, Edge, Firefox, Opera

Chrome/Edge tienen mejor soporte, pero la mayoría de navegadores modernos funcionan.

---

## 🎓 Aprendizaje

### ¿Necesito conocimientos técnicos para usar la PWA?
**No.** Para usar la app, solo necesitas:
1. Abrir Chrome
2. Ir a la URL
3. Presionar "Instalar"

Para personalización, hay guías paso a paso incluidas.

---

### ¿Necesito saber programar para personalizarla?
**Solo para cambios avanzados.** Los cambios básicos (iconos, colores, nombre) son copiar/pegar en archivos JSON.

**Guía:** [PWA_CUSTOMIZATION.md](PWA_CUSTOMIZATION.md)

---

## ✅ Checklist Final

### ¿Mi PWA está lista para producción si...?

- ✅ Se instaló correctamente en la tablet
- ✅ Tiene iconos personalizados (o placeholders)
- ✅ Se abre en pantalla completa (sin barra Chrome)
- ✅ Puedo crear y editar pedidos
- ✅ La sincronización funciona
- ✅ Todo el equipo la tiene instalada
- ✅ Está en HTTPS

**Si respondiste SÍ a todo: ¡Listo para producción! 🎉**

---

**¿Tienes más preguntas? Revisa la documentación completa o consulta los logs de error en Chrome DevTools para debugging técnico.**
