# ⚡ Pasos Rápidos - De 0 a Producción

## 🎯 3 Fases Simples

### FASE 1: LOCAL (30 min)
```bash
npm install
cp .env.example .env
# Edita .env con tus credenciales
npm run dev
```
✅ Genera iconos: `public/icons/generate-placeholder-icons.html`  
✅ Agrega imágenes: `public/images/` (3 archivos)  
✅ Actualiza: `components/PublicOrderForm.tsx`

### FASE 2: GITHUB (10 min)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pasteleria-crm.git
git push -u origin main
```
📝 Crea repo en: https://github.com/new

### FASE 3: VERCEL (5 min)
1. Ve a: https://vercel.com/new
2. Conecta tu repo de GitHub
3. Agrega variables de entorno (las mismas del .env)
4. Deploy!

## ✅ Tu App Estará Lista

🌐 URL: `https://tu-proyecto.vercel.app`  
📱 Formulario: `https://tu-proyecto.vercel.app/#/pedido`

**Instala en tableta:**
1. Abre URL en Chrome
2. Menú → "Agregar a pantalla de inicio"
3. ¡Listo!

---

📚 **Detalles completos:** [RESUMEN_DEPLOYMENT.md](RESUMEN_DEPLOYMENT.md)
