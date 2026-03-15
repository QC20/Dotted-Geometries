# Dotted Geometries

A generative visualization that transforms 3D geometry into low-resolution dot patterns through real-time processing and spatial quantization.

## Overview

Dotted Geometries explores the aesthetic and perceptual qualities of information reduction. The project renders an animated 3D box in a high-resolution buffer, then reconstructs it through a grid of dots whose sizes are determined by the brightness values of the original scene. The result is a pixelated, tile-based interpretation of the source geometry that shifts and evolves with each frame.

The visualization responds to your mouse position. Moving the cursor horizontally adjusts the resolution or granularity of the output, allowing you to dynamically control the level of detail visible in the piece. Lower tile counts reveal a more abstracted, almost sculptural quality, while higher counts approach the original rendered geometry.

## Technical Foundations

The project uses p5.js with WebGL rendering to create the base 3D geometry, then performs a secondary render-to-texture operation that downsamples the result into discrete brightness values. This two-stage rendering pipeline introduces a specific kind of abstraction that sits between direct representation and complete abstraction.

The core algorithm implements a sampling and mapping strategy. For each tile in the output grid, the system determines the corresponding pixel in the source buffer, reads its brightness value, and maps that brightness onto a dot diameter. This creates a form of spatial dithering that communicates tonal information through distributed dot sizes rather than color or direct pixel placement.

The rotating 3D box cycles through multiple axes of rotation at different speeds, creating compound motion that remains visually interesting across extended viewing periods. The lighting model includes both ambient and directional light sources positioned to emphasize the geometry's dimensionality.

## Customization and Variations

The piece contains several parameters that can be adjusted to generate different visual results:

- **Tile resolution** can be modified directly in the code rather than through mouse control. Locking it to a fixed value creates a more static composition, whereas very high tile counts begin to resolve back toward photorealism.

- **The 3D geometry** isn't limited to a box. Substituting other p5 shapes like spheres, tori, or custom vertex forms would produce distinctly different dot patterns while preserving the core algorithmic approach.

- **Rotation speeds and axes** can be changed to create different temporal qualities. Slower rotations emphasize the grid structure itself, while faster ones create flowing, kinetic effects.

These adjustments shift not just the visual output but the conceptual framing of the work itself. Fixing the resolution, for instance, transforms the piece from an interactive, responsive system into something more static and contemplative. Changing the geometry moves the focus from studying resolution reduction in general to exploring how specific three-dimensional forms compress and distribute through this abstraction.

## Running Locally

Open `index.html` in a modern web browser. The project requires no external dependencies beyond the p5.js library, which loads from a CDN.

To clone and run locally, use `git clone https://github.com/QC20/Dotted-Geometries.git` then open `index.html` in your browser.

## Concept

Created as part of GENUARY 2026, a month-long creative coding challenge. Day 4's theme was "Lowres" — exploring how reduction in resolution and detail shifts perception and aesthetic experience.