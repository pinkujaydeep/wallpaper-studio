# Wallpaper Studio — V3 + V4 Combined

This is a single project containing the V3 and V4 feature sets so they can be tested together.

## V3
- AI Studio UI
- Prompt-based Demo AI mode without an API
- Optional custom server-side AI endpoint
- 20 procedural styles
- Phone, tablet, laptop and desktop resolutions
- Full-resolution PNG export
- Seed system
- Local generation
- Advanced controls
- Favorites

## V4
- Studio / Batch / Library navigation
- Generate 6 variations at once
- Personal local wallpaper library
- Shareable configuration links
- Live preview mode
- Batch variation workflow
- Local persistence with localStorage
- AI-ready provider abstraction
- Mobile responsive UI

## Important: real AI
The default "Demo AI" mode does NOT call an AI service. It converts the prompt into a deterministic local wallpaper recipe.

To use real AI later:
1. Create your own backend endpoint.
2. Keep the provider API key on the backend.
3. Return JSON such as `{ "imageUrl": "https://..." }`.
4. Select "My AI endpoint" and enter the endpoint URL.

Do not put an OpenAI/other provider secret directly in React/Vite frontend code.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
