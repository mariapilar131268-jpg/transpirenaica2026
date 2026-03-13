# 📋 INSTRUCCIONES DEL PROYECTO — TRANSPIRENAICA 2026
*Documento de referencia para Claude · Actualizado Marzo 2026*

---

## 🎯 QUÉ ES ESTE PROYECTO

PWA (app móvil instalable) para coordinar la **Transpirenaica 2026**, un viaje en moto de 7 pilotos desde Cap de Creus hasta Faro de Higuer, 18–23 junio 2026, ~1.585 km.

**Coordinadora y desarrolladora única:** Pili (Santa Coloma de Gramenet). No es informática. Quiere resultados claros, eficaces y que no se rompan.

**URL pública:** https://mariapilar131268-jpg.github.io/transpirenaica2026/

---

## 👥 LOS PILOTOS

| Piloto | Moto | Licencia | Con quién |
|--------|------|----------|-----------|
| 🐛 Alberto | Yamaha R9 | A2 | con Oriol |
| 🐣 Oriol | KTM 790 Duke | A2 | con Alberto |
| 🏅 Antonio | Kawasaki Ninja 1000SX | A | con Mónica |
| 🏅 Mónica | Honda CB650R (negra) | A | con Antonio |
| 🏅 Pedro | BMW S1000XR | A | solo (`esPedro:true`) |
| 🏅 Xavi | Ducati Multistrada | A | solo |
| 🏅 Antonio Jaén | BMW R1300RT | A | solo |

**Regla A2:** los mensajes para Alberto y Oriol deben ser **afectuosos y divertidos**, nunca condescendientes. Nunca llamarles "veteranos".

---

## 🗓️ LA RUTA (CONFIRMADA)

| Día | Fecha | Tramo | Km |
|-----|-------|-------|-----|
| Día 0 | 18/06 | Montcada → Port de la Selva | 165 km |
| Día 1 | 19/06 | Cap de Creus → Sort | 318 km |
| Día 2 | 20/06 | Sort → Bonaigua → Vielha → Aínsa | 300 km |
| Día 3 | 21/06 | Aínsa → Portalet → Tourmalet → Aubisque → Isaba | 320 km ⭐ |
| Día 4 | 22/06 | Isaba → Irati → Baztán → Hondarribia | 200 km |
| Día 5 | 23/06 | Hondarribia → Santa Coloma (Noche Sant Joan) | 620 km |

**Punto de salida:** Área de Servicio Montcada La Pausa (C-33 km 82.5, dirección norte)

**⚠️ Gavarnie:** es un callejón sin salida (~80 km de desvío). Mencionarlo como POI opcional en texto, pero NUNCA incluirlo como waypoint en Google Maps.

---

## 🏨 ALOJAMIENTOS

| Noche | Lugar | Establecimiento | Teléfono | Estado |
|-------|-------|-----------------|----------|--------|
| Noche 0 | Port de la Selva | *por confirmar* | — | ❌ Pendiente |
| Noche 1 | Sort | Hostal Can Josep | +34 973 620 089 | ✅ Confirmado |
| Noche 2 | Aínsa | Alojamientos Sánchez | +34 974 500 014 | ✅ Confirmado |
| Noche 3 | Isaba | Hostal Lola | +34 948 893 012 | ✅ Confirmado |
| Noche 4 | Hondarribia | *por confirmar* | — | ❌ Pendiente |

**Restaurantes clave:** Ca la Herminda (Port de la Selva), Lo Pigal Casa Kiko (Sort), Callizo (Aínsa), Hostal Lola (Isaba).

---

## 📱 LA APP — ESTADO TÉCNICO

### Ficheros
- **`index.html`** — app completa (HTML + CSS + JS en un solo fichero)
- **`sw.js`** — service worker v5 (`CACHE='transpi2026-v5'`)
- **Siempre subir los dos ficheros juntos a GitHub**

### Estructura de la app
- 3 pestañas: **MI DÍA** · **CHECK** · **PAGOS**
- Pantalla de selección de piloto → botones rectangulares 2 columnas, fondo crema
- Modo conducción (`mcDiaActual`): fuentes grandes (60+), botón Maps azul 68px

### Configuración técnica clave
- Service Worker: `sw.js?v=5`, network-first, limpia cachés antiguas en `activate`
- Sin meta CSP en HTML (GitHub Pages no lo necesita; causa error "blocks eval")
- Manifest: `purpose:"any"` (no maskable), `orientation:"any"`, `start_url:"./?source=pwa"`
- Fuentes: DM Sans (Google Fonts) — si falla internet, usar `system-ui, -apple-system, sans-serif`
- Colores: fondo `#1c2b1a`, botones crema `#e8e0cc`, texto `#1a2a0a`, Maps azul `#1a52a8`

### ⚠️ BUG CRÍTICO RESUELTO — NO REPETIR
`#sel`, `#rutaview` y `#app` deben ser **hermanos independientes en el mismo nivel DOM**, nunca anidados. Si `#app` queda dentro de `#sel`, al ocultar `#sel` se oculta todo → pantalla en blanco. Verificar siempre la estructura DOM antes de entregar.

---

## 🔧 PROCESO DE TRABAJO (SESIÓN A SESIÓN)

### Al inicio de cada sesión
1. **Descargar el fichero actual** de GitHub o usar el que sube Pili
2. Copiar a `/home/claude/index_work.html` como fichero de trabajo
3. Nunca trabajar directamente sobre `/mnt/user-data/outputs/`

### Al hacer cambios
1. Hacer cambios en `index_work.html`
2. **Verificar** con Python/bash que el HTML es válido (sin `#app` dentro de `#sel`, sin basura al final)
3. Copiar resultado a `/mnt/user-data/outputs/index.html`
4. Verificar que `sw.js` también está en outputs si se ha modificado

### Al entregar
1. Usar `present_files` con los dos ficheros
2. Indicar a Pili que suba los dos a GitHub: "Agregar archivo" → "Subir archivos" → arrastrar → "Confirmar cambios"

---

## ✅ CHECKLIST DE CALIDAD (ejecutar antes de entregar)

```python
# Verificaciones obligatorias
checks = {
    'No hay app dentro de sel': '#sel' not in c[c.find('#app'):c.find('#app')+500],
    'SW registrado correctamente': "sw.js?v=5" in c,
    'Sin meta CSP': 'Content-Security-Policy' not in c,
    'DM Sans o system fonts': 'DM Sans' in c or 'system-ui' in c,
    'Sin basura al final': c.strip().endswith('>') or c.strip().endswith('</html>'),
    'Gavarnie no es waypoint Maps': 'Gavarnie' not in [url for url in re.findall(r'maps.*?(?=")', c) if 'waypoints' in url.lower()],
    'Tamaño razonable (>100KB)': len(c) > 100_000,
}
```

---

## 🌐 URLS DE GOOGLE MAPS — ESTADO

### Pendiente de aplicar (generadas sesión 10/03/2026, sin confirmar por Pili):
- **Día 1:** corrección orden waypoints (Repsol Roses estaba antes de Cap de Creus → loop geográfico)
- **Día 3:** eliminación de Gavarnie como waypoint (desvío callejón sin salida ~80 km)
- **Día 4:** corrección dirección Petronor Urzainqui

**⚠️ No aplicar hasta confirmación de Pili en el chat.**

---

## 🏍️ CONSEJOS DE RUTA (de foros moteros, junio)

*(Fuente: bmwmotos.com, wikiloc, yesweride.es — consultados marzo 2026)*

### Clima en junio
- Junio es buena época: puertos abiertos, día largo, menos lluvia que mayo
- Aun así: **llevar siempre impermeable** y forro polar fino — en puertos altos puede refrescar mucho
- Posibles tormentas vespertinas en Pirineo aragonés y navarro

### Gasolineras — puntos críticos
- En Francia son escasas y muchas son de **tarjeta automática** (sin personal)
- Zona de **Argelès-Gazost** (Francia, cerca Tourmalet): hay gasolinera con personal — repostar aquí
- **Bedous** (pasado Escot): gasolinera de tarjeta
- En España: más frecuentes, pero en zonas remotas cierran pronto
- **Recomendación:** salir siempre con el depósito lleno desde el hotel

### Velocidad media realista
- Media de viaje en moto de montaña: **~65 km/h** (incluye paradas, curvas, puertos)
- No planificar más de 300-320 km por etapa para disfrutar sin agobios
- La etapa reina (Día 3, 320 km) es exigente: salida temprana obligatoria

### Puertos — apertura en junio
- Tourmalet y Aubisque: normalmente abiertos en junio (confirmar semana antes en meteofrance o col-du-tourmalet.com)
- Col de la Pierre Saint-Martin (acceso a Isaba): espectacular, curvas técnicas

### Aínsa
- Casco antiguo medieval: no perdérselo aunque sea una parada corta
- Parking en entrada al casco antiguo

### Selva de Irati (Día 4)
- Uno de los tramos más bonitos de la ruta — carreteras estrechas y frondosas
- Fábrica de armas de Orbaizeta: punto de interés histórico en ruta

### Hondarribia
- Zona cara para alojamiento — reservar con mucha antelación
- Puerto pesquero y casco histórico: parada recomendada antes de tocar el Cantábrico

### Consejo general de foro (bmwmotos.com)
> "No hagas etapas de más de 250-300 km al día — más es una paliza y te pierdes cosas"

---

## 📧 EMAILS DE RESERVA — SIEMPRE INCLUIR

1. Solicitar cancelación gratuita (pedir fecha límite)
2. Disponibilidad de desayuno y precio
3. Precio desglosado por habitación
4. Parking para motos (cubierto preferiblemente)

---

## 🚨 LO QUE NO SE PUEDE ROMPER (lecciones aprendidas)

| Problema pasado | Causa | Solución definitiva |
|----------------|-------|---------------------|
| Pantalla en blanco al seleccionar piloto | `#app` anidado dentro de `#sel` | Los tres contenedores son SIEMPRE hermanos |
| App no cargaba en móvil | Google Fonts bloqueaba render sin internet | DM Sans + fallback `system-ui` |
| Basura al final del HTML | Script de generación dejaba residuos | Verificar que termina en `</html>` |
| SW no actualizaba | Versión de caché no incrementada | Incrementar número de versión en cada cambio funcional |
| Tiempos Maps imposibles (9h43) | Gavarnie como waypoint = desvío 80 km | Gavarnie solo como texto, NUNCA en URL de Maps |
| Waypoints en orden incorrecto (Día 1) | Repsol Roses antes de Cap de Creus | Orden geográfico: salida → destino, sin retrocesos |

---

## 📌 TAREAS PENDIENTES

- [ ] Aplicar 3 correcciones de URLs Google Maps (Días 1, 3, 4) — pendiente OK de Pili
- [ ] Confirmar y añadir hotel Noche 0 (Port de la Selva)
- [ ] Confirmar y añadir hotel + cena Noche 4 (Hondarribia)
- [ ] Implementar pestaña RUTA completa con waypoints expandibles y botón "Cómo llegar" por punto
- [ ] Verificar tiempo real Tourmalet + Aubisque abiertos en junio (consultar semana del 15/06)

---

## 🔍 CÓMO BUSCAR INFORMACIÓN NUEVA

1. **Siempre consultar foros moteros primero:** bmwmotos.com, forocoches (sección motos), ducatistas.net, bikerfriendly.es
2. Para gasolineras en ruta: wikiloc + commentarios de otros moteros
3. Para hoteles: booking + llamar directamente para negociar parking motos
4. Para estado de puertos: meteofrance.com, col-du-tourmalet.com, pasospirineos.com

---

*Documento generado automáticamente por Claude · Proyecto Transpirenaica 2026 · Pili coordinadora*
