# Wallpaper Studio V2

Polished procedural wallpaper generator.

## New in V2
- 20 visual styles
- Phone HD/QHD/4K
- Laptop FHD/QHD/4K
- Desktop 4K
- Tablet preset
- Full-resolution PNG export
- Density, glow, grain and vignette controls
- 8 color palettes
- Seed-based reproducibility
- Favorites/history in localStorage
- Randomize and Surprise Me
- Responsive mobile UI
- Fully local Canvas rendering

## Run

npm install
npm run dev

## Build

npm run build

## V2.0.1 fix
The V2.0 package contained an invalid `Blur` icon import from `lucide-react`.
This patch removes that import. No other functionality depends on it.
