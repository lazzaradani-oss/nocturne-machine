# The Nocturne Machine

An experimental interactive web experience exploring atmosphere, motion, light, and playful interaction.

## Build Guide

For the complete build process, architecture, and implementation reference:

[**Read the Nocturne Machine Build Guide (PDF)**](https://docs.google.com/document/d/1zUw3j26KdhNPG_u5rCANwh4fUqY5pD2SodIP7bKbqIc/edit?usp=sharing)

## Why It Exists

The Nocturne Machine was the **first prototype for a different kind of portfolio**.

Rather than building another conventional portfolio site, the goal was to make something **distinctly mine**: an atmospheric interactive art piece where design, code, motion, light, and interaction could exist together.

It became a proof of concept for a larger idea:

> **What if atmosphere could become a reusable design system?**

Nocturne is therefore more than a standalone visual experiment. It is **Experiment 001** in a developing Logic & Luster visual technology system.

## Concept

The Nocturne Machine is an atmospheric interactive environment built around a luminous central machine that responds to human presence.

Move toward the machine. Watch the atmosphere shift. Wake it.

## Experience

- Cursor-responsive central orb
- Breathing light and atmosphere
- Procedural particle field
- Rotating orbital rings
- Interactive **WAKE** state
- Responsive/mobile layout
- Reduced-motion support
- Minimal, immersive interface

## Reusable Ambient Systems

The interaction patterns developed for Nocturne are intended to become reusable building blocks for future Logic & Luster projects.

### AmbientScene

A lightweight environmental system for combining:

- Ambient particles
- Atmospheric depth
- Light and glow
- Gentle motion
- Responsive environmental behavior

### VolumetricLight

A reusable light system that can adapt to:

- Forests
- Windows
- Rooms
- Water
- Illustrated environments

### LivingImage

A layered approach for making static artwork feel alive:

**Base image → environmental movement → atmospheric detail**

Examples include drifting light, floating embers, moving reflections, haze, dust, or other subtle environmental motion.

### CursorLuster

A restrained cursor-responsive light or atmospheric distortion for desktop environments, with touch-device fallback.

### ScrollAtmosphere

Scroll-driven movement and reveals that allow the interaction itself to become part of the story or case study.

### ProceduralNoise

Lightweight generative texture for grain, dust, stars, paper texture, or other tactile visual detail.

### Design Principle

These systems are intentionally small and reusable. The goal is not to add animation for its own sake, but to create a **shared Logic & Luster visual language** that can make different projects feel alive while keeping the underlying artwork and content intact.

The first implementation is Nocturne Machine. Future projects can reuse the same principles with different parameters, environments, imagery, and interaction patterns.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- pnpm

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open the local development URL shown by Vite.

## Build

```bash
pnpm build
```

## Project Structure

```text
nocturne-machine/
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design Direction

**Logic & Luster**  
Dark plum, black, and luminous lavender with a midcentury-inspired experimental visual language.

## Portfolio

The Nocturne Machine is designed as a standalone creative-technology experiment that can later be embedded or linked from the Logic & Luster portfolio.

## Author

Designed and developed by Danielle Lazzara.
