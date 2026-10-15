# Closet Love ♡

App web/PWA para organizar ropa, calzado, accesorios, joyería y maquillaje, y crear sugerencias de looks.

## Características
- Fotos desde galería o cámara del teléfono.
- Categorías de ropa, calzado, accesorios, joyería y maquillaje.
- Color, temporada, ocasión, estilo y tonalidad.
- Favoritos.
- Buscador y filtros.
- Generador de looks basado en las piezas guardadas.
- Maquillaje separado.
- Datos guardados localmente en el dispositivo.
- Diseño pastel responsive y preparado como PWA.

## Ejecutar en tu PC
```bash
npm install
npm run dev
```

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub.
2. Sube todos estos archivos.
3. En tu computadora ejecuta:
```bash
npm install
npm run build
```
4. Para una publicación rápida puedes usar GitHub Pages con una herramienta como `gh-pages`, o configurar GitHub Actions para publicar la carpeta `dist`.

> Nota: esta primera versión guarda las fotos y datos en `localStorage`. Eso significa que funcionan en el mismo navegador/dispositivo, pero no hay sincronización entre teléfonos. Para una versión multi-dispositivo con cuentas, nube e IA real habría que añadir un backend (por ejemplo Supabase/Firebase) y un servicio de visión.

## Privacidad
Las fotos no se envían a ningún servidor en esta versión.
