# LiveTune MVP — Week 1

MVP de una emisora web inteligente que descubre transmisiones musicales en vivo de YouTube según género y mood, y las reproduce mediante un reproductor embebido de YouTube.

## Funcionalidades incluidas

- Selector de género musical.
- Selector de mood.
- Búsqueda real usando YouTube Data API v3.
- Reproductor embebido de YouTube usando `youtube-nocookie.com`.
- Cola de transmisiones en vivo.
- Botón `Next station`.
- Guardar canal en `localStorage`.
- Manejo de errores si falta la API key o falla la búsqueda.
- Configuración lista para GitHub + Netlify.

## Stack

- Next.js 14
- React 18
- TypeScript
- CSS global
- YouTube Data API v3
- Netlify

## Ejecutar localmente

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo local de variables:

```bash
cp .env.example .env.local
```

3. Agregar tu API key de YouTube:

```bash
YOUTUBE_API_KEY=your_youtube_data_api_key_here
```

4. Correr el proyecto:

```bash
npm run dev
```

5. Abrir:

```bash
http://localhost:3000
```

## Variables de entorno necesarias

En local debes crear `.env.local`.

En Netlify debes configurar esta variable en:

`Site configuration → Environment variables`

```bash
YOUTUBE_API_KEY=your_youtube_data_api_key_here
```

No uses `NEXT_PUBLIC_YOUTUBE_API_KEY`, porque expondría la llave en el navegador.

## Deploy en Netlify

Configuración incluida en `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

Pasos:

1. Sube este proyecto a GitHub.
2. Entra a Netlify.
3. Selecciona `Add new site` → `Import an existing project`.
4. Conecta GitHub.
5. Selecciona el repositorio.
6. Build command: `npm run build`.
7. Publish directory: `.next`.
8. Agrega `YOUTUBE_API_KEY` en Environment variables.
9. Deploy.

## Notas sobre YouTube

La ruta backend usa:

- `type=video`
- `eventType=live`
- `videoEmbeddable=true`
- `videoSyndicated=true`
- `safeSearch=moderate`

El MVP no extrae audio ni crea un stream propio. Solo muestra transmisiones usando el embed oficial de YouTube.

## Próximos pasos sugeridos para Semana 2

- Agregar Supabase.
- Cachear resultados por género y mood.
- Guardar eventos de escucha.
- Agregar dislike / bloquear canal.
- Crear estaciones predefinidas.
- Crear job programado para refrescar lives.
