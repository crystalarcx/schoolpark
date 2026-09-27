import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 512x512 Master SVG Touch Icon Design
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient: Deep Midnight Indigo to Vibrant Royal Blue -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <!-- Pin Gradient: Warm Radiant Amber to Golden Yellow -->
    <linearGradient id="pinGrad" x1="160" y1="70" x2="352" y2="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <!-- Glow Gradient -->
    <radialGradient id="ambientGlow" cx="256" cy="180" r="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#312e81" stop-opacity="0" />
    </radialGradient>

    <!-- Car Gradient -->
    <linearGradient id="carGrad" x1="200" y1="360" x2="312" y2="440" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>

    <!-- Shadow filter for Pin -->
    <filter id="dropShadow" x="120" y="50" width="272" height="340" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Base App Background (iOS Squircle / Full fill) -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Ambient Light Reflection -->
  <circle cx="256" cy="190" r="210" fill="url(#ambientGlow)" />

  <!-- Subtle Campus Gate Arch (School contour) -->
  <path d="M 120 440 L 120 280 C 120 200, 392 200, 392 280 L 392 440" 
        stroke="#4f46e5" stroke-width="8" stroke-dasharray="12 12" stroke-linecap="round" opacity="0.35" fill="none" />

  <!-- Main Location Pin with Drop Shadow -->
  <g filter="url(#dropShadow)">
    <path d="M 256 68 
             C 178.7 68 116 130.7 116 208 
             C 116 296 230 398 245.5 411.7 
             C 251.6 417.1 260.4 417.1 266.5 411.7 
             C 282 296 396 208 396 208 
             C 396 130.7 333.3 68 256 68 Z" 
          fill="url(#pinGrad)" />
  </g>

  <!-- Pin Inner Core (Crisp White Circle) -->
  <circle cx="256" cy="202" r="76" fill="#ffffff" />

  <!-- Bold Parking Symbol 'P' in Vibrant Indigo -->
  <path d="M 238 152 
           L 266 152 
           C 283 152 295 163 295 178 
           C 295 193 283 204 266 204 
           L 248 204 
           L 248 252 
           L 230 252 
           L 230 152 
           L 238 152 Z 
           M 248 168 
           L 248 188 
           L 264 188 
           C 272 188 277 184 277 178 
           C 277 172 272 168 264 168 
           L 248 168 Z" 
        fill="#1e1b4b" />

  <!-- Modern Sleek Car Silhouette Badge at bottom of Pin -->
  <g transform="translate(176, 320)">
    <!-- Car Base Badge Background -->
    <rect x="0" y="24" width="160" height="76" rx="22" fill="#0f172a" opacity="0.8" />
    <rect x="2" y="26" width="156" height="72" rx="20" stroke="#38bdf8" stroke-width="2" opacity="0.6" fill="none" />
    
    <!-- Stylized Car Body -->
    <path d="M 32 68 
             C 34 60, 42 54, 52 54 
             L 66 54 
             L 78 40 
             C 81 37, 85 35, 90 35 
             L 114 35 
             C 120 35, 126 38, 129 44 
             L 138 56 
             L 142 58 
             C 147 59, 150 63, 150 68 
             L 150 78 
             C 150 81, 148 83, 145 83 
             L 138 83 
             C 137 77, 131 72, 124 72 
             C 117 72, 111 77, 110 83 
             L 62 83 
             C 61 77, 55 72, 48 72 
             C 41 72, 35 77, 34 83 
             L 27 83 
             C 24 83, 22 81, 22 78 
             L 22 72 
             C 22 68, 25 65, 29 65 
             L 32 68 Z" 
          fill="#38bdf8" />
          
    <!-- Car Windows -->
    <path d="M 83 42 
             L 94 42 
             L 94 53 
             L 74 53 
             Z 
             M 98 42 
             L 116 42 
             C 119 42, 122 44, 124 47 
             L 128 53 
             L 98 53 
             Z" 
          fill="#0f172a" opacity="0.9" />

    <!-- Wheels -->
    <circle cx="48" cy="83" r="10" fill="#f8fafc" />
    <circle cx="48" cy="83" r="5" fill="#334155" />
    <circle cx="124" cy="83" r="10" fill="#f8fafc" />
    <circle cx="124" cy="83" r="5" fill="#334155" />

    <!-- Headlight beam -->
    <polygon points="144,66 156,63 156,73" fill="#fef08a" opacity="0.9" />
  </g>

  <!-- Luminous Edge Border for App Icon polish -->
  <rect x="3" y="3" width="506" height="506" rx="110" stroke="#ffffff" stroke-width="4" stroke-opacity="0.15" fill="none" />
</svg>
`;

async function generate() {
  // Write SVG file
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon, 'utf8');

  const svgBuffer = Buffer.from(svgIcon);

  // Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate apple-touch-icon-precomposed.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));

  // Generate 192x192 icon (Android Chrome home screen)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-192.png'));

  // Generate 512x512 master icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon-512.png'));

  // Generate 32x32 favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  console.log('Successfully generated all touch icons and favicons in /public');
}

generate().catch(console.error);
