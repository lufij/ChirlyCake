# 🧪 Test del Visor de Imágenes con Zoom

## ✅ Checklist de Pruebas

### 📱 Pruebas en Móvil/Tableta

#### Básicas (Obligatorias)
- [ ] **Abrir visor**: Tocar imagen abre el visor en pantalla completa
- [ ] **Cerrar visor**: Botón X cierra el visor
- [ ] **Cerrar con fondo**: Tocar área negra cierra el visor
- [ ] **Zoom con botones**: Los botones +/- funcionan correctamente
- [ ] **Indicador de zoom**: Muestra el porcentaje correcto (100%, 150%, etc.)
- [ ] **Botón rotar**: Rota la imagen 90° cada vez
- [ ] **Pinch-to-zoom**: Pellizcar con dos dedos hace zoom
- [ ] **Doble tap**: Tocar dos veces amplía a 2.5x o resetea
- [ ] **Arrastrar**: Se puede mover la imagen cuando está ampliada
- [ ] **Reset posición**: Al reducir a 100%, la posición se resetea
- [ ] **Scroll bloqueado**: El body no hace scroll mientras el visor está abierto
- [ ] **Instrucciones visibles**: Se muestran las instrucciones en la parte inferior

#### Avanzadas (Recomendadas)
- [ ] **Zoom máximo**: No permite zoom mayor a 5x (500%)
- [ ] **Zoom mínimo**: No permite zoom menor a 1x (100%)
- [ ] **Transiciones suaves**: El zoom es suave, no abrupto
- [ ] **No se corta**: La imagen nunca se sale de la pantalla
- [ ] **Orientación**: Funciona en vertical y horizontal
- [ ] **Múltiples imágenes**: Cada imagen abre su propio visor
- [ ] **Calidad**: La imagen mantiene buena calidad al ampliar

### 💻 Pruebas en Desktop

#### Básicas (Obligatorias)
- [ ] **Hover effect**: Al pasar mouse aparece icono de zoom
- [ ] **Overlay oscuro**: Aparece fondo semi-transparente en hover
- [ ] **Click abre visor**: Click en imagen abre el visor
- [ ] **Zoom con rueda**: La rueda del mouse hace zoom
- [ ] **Arrastrar con mouse**: Se puede arrastrar cuando está ampliada
- [ ] **Cursor cambia**: Muestra cursor "grab" cuando puede arrastrar
- [ ] **Cursor grabbing**: Cambia a "grabbing" al arrastrar
- [ ] **Botones funcionan**: Todos los botones responden al click

#### Avanzadas (Recomendadas)
- [ ] **Zoom preciso**: Rueda del mouse permite zoom fino
- [ ] **Click en fondo**: Click fuera de la imagen cierra el visor
- [ ] **ESC cierra**: Presionar ESC cierra el visor (si implementado)
- [ ] **Navegación con teclado**: Funciona con Tab
- [ ] **Accesibilidad**: Screen readers pueden leer los botones

### 🎯 Pruebas por Componente

#### OrderList (Lista de Pedidos)
- [ ] **Imagen principal**: La imagen de la tarjeta tiene zoom
- [ ] **Modal detalle**: Las imágenes del detalle tienen zoom
- [ ] **Múltiples imágenes**: Todas las imágenes de referencia tienen zoom
- [ ] **Texto helper**: Muestra "Toca para ampliar"

#### OrderForm (Formulario de Pedidos)
- [ ] **Vista previa**: Las imágenes subidas tienen zoom
- [ ] **Botón eliminar**: El botón X funciona sin abrir el visor
- [ ] **Tamaño correcto**: Las miniaturas se ven bien

#### PublicOrderForm (Formulario Público)
- [ ] **Imágenes subidas**: Las referencias tienen zoom
- [ ] **Botón eliminar funciona**: Se puede eliminar sin abrir visor
- [ ] **Galería responsive**: Se adapta a móvil y desktop
- [ ] **Tipos de pastel**: Las imágenes de tipos NO tienen zoom (correcto)

### 🐛 Pruebas de Edge Cases

#### Comportamiento Extremo
- [ ] **Sin conexión**: Las imágenes cacheadas se pueden ampliar
- [ ] **Imagen muy grande**: Se carga completamente antes de mostrar
- [ ] **Imagen muy pequeña**: Se ve bien incluso si es pequeña
- [ ] **Zoom rápido**: No se rompe al hacer zoom muy rápido
- [ ] **Rotación múltiple**: Rotar varias veces funciona correctamente
- [ ] **Cambio de orientación**: Funciona al rotar el dispositivo
- [ ] **Baja memoria**: No causa lag en dispositivos lentos

#### Interacción Compleja
- [ ] **Zoom + Rotar**: Funciona hacer ambas cosas
- [ ] **Arrastrar + Zoom**: Se puede arrastrar mientras se hace zoom
- [ ] **Múltiples touches**: No se rompe con touches accidentales
- [ ] **Touch prolongado**: No abre menú contextual del navegador
- [ ] **Pinch rápido**: Maneja pinch zoom muy rápido
- [ ] **Cancelar arrastre**: Soltar fuera no causa problemas

### 📊 Pruebas de Rendimiento

#### Velocidad
- [ ] **Apertura instantánea**: El visor abre inmediatamente (<100ms)
- [ ] **Zoom fluido**: El zoom es suave a 60fps
- [ ] **Sin lag**: No hay retraso al arrastrar
- [ ] **Cierre rápido**: El visor cierra instantáneamente
- [ ] **Múltiples aperturas**: No se degrada con uso repetido

#### Memoria
- [ ] **Sin leaks**: No consume más memoria con el tiempo
- [ ] **Limpia recursos**: Cierra correctamente todos los listeners
- [ ] **Múltiples imágenes**: Puede abrir muchas sin problemas

### 🌐 Compatibilidad de Navegadores

#### Móvil
- [ ] **Chrome Android**: Funciona perfectamente
- [ ] **Safari iOS**: Funciona perfectamente
- [ ] **Firefox Mobile**: Funciona bien
- [ ] **Samsung Internet**: Funciona (puede tener limitaciones)
- [ ] **Opera Mobile**: Funciona bien

#### Tableta
- [ ] **iPad Safari**: Funciona perfectamente
- [ ] **Android Chrome**: Funciona perfectamente
- [ ] **Tableta Sunmi**: ✅ PRIORITARIO - Debe funcionar 100%

#### Desktop
- [ ] **Chrome**: Funciona perfectamente
- [ ] **Firefox**: Funciona perfectamente
- [ ] **Safari**: Funciona perfectamente
- [ ] **Edge**: Funciona perfectamente

### 🎨 Pruebas Visuales

#### Apariencia
- [ ] **Fondo negro**: El overlay es negro con 95% opacidad
- [ ] **Controles visibles**: Los botones destacan sobre el fondo
- [ ] **Gradientes suaves**: Los gradientes se ven bien
- [ ] **Iconos claros**: Los iconos son reconocibles
- [ ] **Textos legibles**: Todo el texto se lee bien
- [ ] **Bordes redondeados**: Los botones tienen border-radius
- [ ] **Sombras**: Los elementos tienen sombras apropiadas

#### Responsive
- [ ] **320px width**: Funciona en móviles pequeños
- [ ] **768px width**: Funciona en tabletas
- [ ] **1024px width**: Funciona en tablets grandes
- [ ] **1920px width**: Funciona en desktop
- [ ] **Orientación vertical**: Se adapta correctamente
- [ ] **Orientación horizontal**: Se adapta correctamente

---

## 🚀 Cómo Ejecutar las Pruebas

### Preparación
```bash
npm run dev
```

### 1. Pruebas Básicas (5 minutos)

#### En Móvil/Tableta:
1. Abre la app en tu tableta Sunmi
2. Ve a "Pedidos"
3. Toca cualquier imagen
4. Verifica:
   - ✅ Se abre el visor
   - ✅ Puedes hacer zoom con pellizcar
   - ✅ Puedes arrastrar
   - ✅ Puedes cerrar

#### En Desktop:
1. Abre http://localhost:3000
2. Ve a "Pedidos"
3. Haz hover sobre una imagen
4. Click en la imagen
5. Verifica:
   - ✅ Aparece icono de zoom en hover
   - ✅ Se abre el visor
   - ✅ Rueda del mouse hace zoom
   - ✅ Puedes arrastrar
   - ✅ Puedes cerrar

### 2. Pruebas de Componentes (10 minutos)

#### OrderList
```
1. Ve a Pedidos
2. Click en un pedido con imagen
3. Verifica que la imagen principal tiene zoom
4. Abre el detalle
5. Verifica que las imágenes de referencia tienen zoom
```

#### OrderForm
```
1. Ve a Pedidos → "Nuevo Pedido"
2. Sube una imagen de referencia
3. Verifica que la vista previa tiene zoom
4. Click en la imagen
5. Verifica que se amplía correctamente
```

#### PublicOrderForm
```
1. Abre /#/pedido
2. Scroll hasta "Imágenes de Referencia"
3. Sube una imagen
4. Click en la miniatura
5. Verifica que se amplía
6. Verifica que el botón X elimina sin abrir visor
```

### 3. Pruebas de Estrés (5 minutos)

```
1. Abre y cierra el visor 20 veces seguidas
   → Debe funcionar sin degradación

2. Haz zoom in/out muy rápido 10 veces
   → Debe ser fluido

3. Rota la imagen 20 veces
   → Debe funcionar perfectamente

4. Abre 10 imágenes diferentes
   → Todas deben funcionar igual

5. Haz pinch zoom extremo (muy rápido y grande)
   → No debe crashear
```

### 4. Pruebas de Compatibilidad (15 minutos)

```
Prueba en:
1. Tu tableta Sunmi principal
2. Tu móvil personal
3. Otro móvil o tableta diferente
4. Desktop con Chrome
5. Desktop con Firefox

En cada uno verifica:
- Abrir visor ✅
- Zoom ✅
- Arrastrar ✅
- Cerrar ✅
```

---

## ✅ Criterios de Aceptación

### Mínimo Viable (Debe pasar TODO esto)
- ✅ El visor abre al tocar/click cualquier imagen
- ✅ El zoom funciona hasta 5x
- ✅ Se puede arrastrar cuando está ampliada
- ✅ Se puede cerrar con X o tocando el fondo
- ✅ Funciona en tableta Sunmi
- ✅ Funciona en móviles comunes
- ✅ Funciona en desktop

### Deseable (Bueno tener)
- ✅ Pinch-to-zoom funciona suave
- ✅ Doble tap funciona
- ✅ Hover effect en desktop
- ✅ Instrucciones visibles en móvil
- ✅ Transiciones suaves
- ✅ No hay lag ni retraso

### Excelente (Extra)
- ✅ Funciona offline
- ✅ Rápido en dispositivos lentos
- ✅ Accesible con teclado
- ✅ Screen readers compatible
- ✅ Funciona en orientación vertical y horizontal

---

## 🐛 Problemas Conocidos

### Issues Reportados: Ninguno

Si encuentras problemas:
1. Anótalos aquí
2. Incluye:
   - Dispositivo y navegador
   - Pasos para reproducir
   - Comportamiento esperado
   - Comportamiento actual
   - Screenshots si es posible

---

## 📝 Reporte de Pruebas

### Testeado por: _____________
### Fecha: _____________
### Dispositivos probados:
- [ ] Tableta Sunmi (Modelo: ________)
- [ ] Móvil Android (Modelo: ________)
- [ ] iPhone (Modelo: ________)
- [ ] Desktop Chrome
- [ ] Desktop Firefox

### Resultado General:
- [ ] ✅ Aprobado - Todo funciona perfectamente
- [ ] ⚠️ Aprobado con observaciones - Funciona pero hay detalles
- [ ] ❌ Rechazado - Hay problemas críticos

### Observaciones:
```
(Escribe aquí cualquier observación o problema encontrado)
```

### Screenshots:
```
(Agrega aquí screenshots de problemas o éxitos)
```

---

## 🎯 Siguiente Paso

Una vez completadas todas las pruebas y aprobado:

1. ✅ Marca este documento como "APROBADO"
2. 📝 Actualiza el CHANGELOG.md con la fecha de release
3. 🚀 Procede con el deployment a producción
4. 📱 Prueba en producción en la tableta Sunmi real
5. 🎉 Celebra! 🍰

---

**Versión del Test:** 1.0  
**Última actualización:** Noviembre 2024  
**Componente testeado:** ImageViewer.tsx
