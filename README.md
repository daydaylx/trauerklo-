# Trauerkloß (PWA)

Free-Chat mit einem anpassbaren Blob ("Trauerkloß"). OpenRouter API nötig.

## Start
npm i
npm run dev

## Build
npm run build && npm run preview

## OpenRouter
- Einstellungen öffnen und API-Key setzen.
- Model-ID z. B.: "openrouter/auto" oder ein günstiges Chat-Modell.
- Streaming optional (standardmäßig aus).

## PWA
- Manifest + einfacher Service Worker (nur Asset-Cache).
- Icons sind SVG (funktional). PNGs kannst du später ersetzen.

## Struktur
- src/routes: Chat, Editor, Settings
- src/components: UI-Bausteine
- src/features: chat/customize/emotion
- src/services: openrouter + summarize
- src/db: Dexie (IndexedDB)

## Wichtige Grenzen
- Antworten kurz (2–3 Sätze). Token-Caps beachten.
- Verlauf kompakt, bei zu lang: einfache Zusammenfassung (offline).
