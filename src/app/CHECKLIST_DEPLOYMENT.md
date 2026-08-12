# ✅ Checklist de Deployment

## Antes de empezar

- [ ] Node.js instalado (versión 18+)
- [ ] Visual Studio Code instalado
- [ ] Cuenta en Vercel creada
- [ ] Cuenta en GitHub creada (opcional pero recomendado)

## Configuración Local

- [ ] Código descargado en tu computadora
- [ ] Carpeta abierta en VS Code
- [ ] Terminal abierta en VS Code
- [ ] `npm install` ejecutado correctamente
- [ ] Archivo `.env` creado con las credenciales correctas
- [ ] Iconos PWA generados y guardados en `public/icons/`
- [ ] `npm run verify` ejecutado sin errores
- [ ] `npm run dev` funciona correctamente
- [ ] Aplicación abierta en http://localhost:3000
- [ ] Login funciona correctamente
- [ ] Pedidos se pueden crear
- [ ] Formulario público funciona en http://localhost:3000/#/pedido

## Build Local

- [ ] `npm run build` ejecutado sin errores
- [ ] Carpeta `dist` creada
- [ ] `npm run preview` funciona correctamente

## Git y GitHub

- [ ] `git init` ejecutado
- [ ] Repositorio creado en GitHub
- [ ] `.gitignore` configurado correctamente
- [ ] Código subido a GitHub
- [ ] Commits tienen mensajes descriptivos

## Vercel - Variables de Entorno

- [ ] `VITE_SUPABASE_URL` agregado
- [ ] `VITE_SUPABASE_ANON_KEY` agregado  
- [ ] `VITE_SUPABASE_PROJECT_ID` agregado
- [ ] Variables verificadas (sin espacios ni comillas extras)

## Vercel - Deployment

- [ ] Proyecto conectado a GitHub (o código subido)
- [ ] Build settings correctos (Vite detectado automáticamente)
- [ ] Deploy iniciado
- [ ] Deploy completado sin errores
- [ ] URL de producción funciona
- [ ] Login funciona en producción
- [ ] Pedidos se pueden crear en producción
- [ ] Formulario público funciona en producción

## PWA

- [ ] Todos los iconos cargados correctamente
- [ ] `manifest.json` accesible
- [ ] Service worker registrado
- [ ] Aplicación puede instalarse en móvil/tableta
- [ ] Aplicación funciona offline después de primera carga
- [ ] Notificaciones de instalación aparecen

## Supabase

- [ ] Edge Function desplegado
- [ ] Edge Function responde correctamente
- [ ] Auth funciona correctamente
- [ ] Storage configurado para imágenes
- [ ] Logs del servidor sin errores críticos

## Funcionalidades

### Como Propietario
- [ ] Puede hacer login
- [ ] Puede crear pedidos
- [ ] Puede editar pedidos
- [ ] Puede eliminar pedidos
- [ ] Puede cambiar estados de pedidos
- [ ] Puede ver calendario
- [ ] Puede gestionar clientes
- [ ] Puede crear vendedores/administradores
- [ ] Puede ver finanzas
- [ ] Puede ver reportes
- [ ] Puede confirmar pedidos públicos

### Como Vendedor
- [ ] Puede hacer login
- [ ] Puede ver pedidos
- [ ] Puede cambiar estados de pedidos
- [ ] Puede ver calendario
- [ ] Puede ver clientes
- [ ] NO puede ver finanzas
- [ ] NO puede editar pedidos
- [ ] NO puede crear usuarios

### Formulario Público
- [ ] Accesible sin login
- [ ] URL compartible funciona
- [ ] Clientes pueden llenar formulario
- [ ] Pueden seleccionar tipo de cobertura
- [ ] Pueden seleccionar fecha
- [ ] Pueden subir imágenes
- [ ] Pedido se crea como "Pendiente de confirmación"
- [ ] Cliente nuevo se crea automáticamente
- [ ] Propietario puede ver y confirmar pedido

## Tableta Sunmi

- [ ] URL abierta en Chrome
- [ ] Aplicación instalada desde Chrome
- [ ] Ícono aparece en pantalla principal
- [ ] Aplicación abre correctamente
- [ ] Interfaz responsive funciona bien
- [ ] Touch funciona correctamente
- [ ] Teclado aparece en campos de texto
- [ ] Calendario funciona al tocar
- [ ] Formularios son fáciles de llenar

## Rendimiento

- [ ] Página carga en menos de 3 segundos
- [ ] Imágenes cargan correctamente
- [ ] No hay errores en la consola
- [ ] Transiciones son suaves
- [ ] Aplicación responde rápido

## Seguridad

- [ ] Variables de entorno no expuestas
- [ ] Service Role Key solo en servidor
- [ ] Anon Key solo en frontend
- [ ] HTTPS habilitado (Vercel lo hace automáticamente)
- [ ] Autenticación funciona correctamente
- [ ] Roles y permisos funcionan correctamente

## Post-Deployment

- [ ] URL de producción guardada
- [ ] URL compartida con el equipo
- [ ] Link del formulario público compartido
- [ ] Instrucciones de uso compartidas
- [ ] Backup de credenciales guardado
- [ ] Documentación revisada

## Mantenimiento

- [ ] Proceso de actualización documentado
- [ ] Comandos git guardados
- [ ] Proceso de rollback conocido
- [ ] Logs monitoreados periódicamente
- [ ] Backups programados (Supabase lo hace automáticamente)

---

## 🎉 ¡Deployment Completo!

Si todos los checkboxes están marcados, ¡tu aplicación está lista para producción!

**URLs Importantes:**
- App: https://tu-proyecto.vercel.app
- Formulario: https://tu-proyecto.vercel.app/#/pedido
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard

**Siguiente paso:** ¡Empieza a usar tu aplicación! 🍰
