# Wallpaper Studio

A polished React + Vite procedural wallpaper generator.

## Features
- Mobile wallpaper: 1440 × 2560
- Laptop wallpaper: 2560 × 1600
- Six procedural design styles
- Random seed generation
- Palette selection
- Complexity control
- Favorite/history stored in localStorage
- PNG download
- Responsive desktop/mobile UI
- No backend required for generation

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Build

```bash
npm run build
npm run preview
```

The wallpaper itself is generated locally with the HTML Canvas API, so the app does not need an image-generation API for the core feature.
