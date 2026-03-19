/**
 * GENUARY 2026 - Merged Edition
 * Day 4 (Lowres) + Day 24 (Perfectionist's Nightmare)
 * Title: "Quantum Geometries"
 *
 * Algorithm:
 * - A 3D grid of cells exists in two quantum states: unobserved (spinning wireframe flux)
 *   and observed (collapsed into a definite solid geometry).
 * - Mouse movement triggers observation, collapsing nearby cells into the active shape.
 * - Cells decay back to flux after a random lifespan.
 * - The scene is displayed twice: top half is the live 3D render (Reality);
 *   bottom half is a real-time lowres dot-pattern abstraction (Data).
 * - Mouse Y controls the dot resolution of the lowres view.
 * - Keys 1-5 switch the shape that cells collapse into on observation.
 * - Key P toggles dot style between squares (Quantum original) and circles (Lowres original).
 * - Key R resets the grid entirely.
 *
 * Controls:
 *   Mouse drag       - rotate the 3D scene
 *   Mouse move       - observe / collapse quantum cells
 *   Mouse Y position - resolution of the lowres dot view (low = coarse, high = fine)
 *   1  Box (default)
 *   2  Sphere
 *   3  Torus
 *   4  Cone
 *   5  Cylinder
 *   P  Toggle dot style: square / circle
 *   R  Reset grid
 */

// ---- Grid config -------------------------------------------------------
let grid = [];
const COLS   = 3;
const ROWS   = 13;
const DEPTHS = 5;
let cellSize;
const MARGIN = 0;

// ---- Rotation state ----------------------------------------------------
let rotX = 0;
let rotY = 0;
let targetRotX = -0.2;
let targetRotY = 0.5;

// ---- Off-screen WebGL buffer -------------------------------------------
let pg;
const PG_SIZE  = 400;
const MAX_TILES = 80;

// ---- Shape / dot mode --------------------------------------------------
// 0 = Box, 1 = Sphere, 2 = Torus, 3 = Cone, 4 = Cylinder
let shapeMode  = 0;
const SHAPE_NAMES  = ['BOX', 'SPHERE', 'TORUS', 'CONE', 'CYLINDER'];
let dotCircle  = false; // false = square (Quantum style), true = circle (Lowres style)

// ---- p5 lifecycle ------------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(PG_SIZE, PG_SIZE, WEBGL);
  calculateLayout();
  initGrid();
}

function draw() {
  background(0);
  pg.background(0);

  // Drag to rotate
  if (mouseIsPressed) {
    targetRotY += (mouseX - pmouseX) * 0.01;
    targetRotX -= (mouseY - pmouseY) * 0.01;
  }
  rotX = lerp(rotX, targetRotX, 0.1);
  rotY = lerp(rotY, targetRotY, 0.1);

  // Render 3D grid into the off-screen buffer
  renderGridToBuffer();

  // Layout dimensions
  const halfH      = height / 2;
  const displaySize = min(width * 0.45, halfH * 0.85);

  imageMode(CENTER);

  // ---- TOP HALF: 3D Reality ------------------------------------------
  image(pg, width / 2, halfH * 0.5, displaySize, displaySize);

  // Divider line
  stroke(40);
  strokeWeight(1);
  line(width * 0.1, halfH, width * 0.9, halfH);

  // ---- BOTTOM HALF: Lowres Data Abstraction --------------------------
  // Faint ghost of the 3D render underneath the dot layer
  tint(255, 30);
  image(pg, width / 2, halfH * 1.5, displaySize, displaySize);
  noTint();

  drawDotGrid(halfH, displaySize);

  // ---- UI Labels -----------------------------------------------------
  drawLabels(halfH, displaySize);
}

// ---- Grid init ---------------------------------------------------------

function calculateLayout() {
  const availableH = PG_SIZE * 0.95;
  cellSize = availableH / (ROWS + ROWS * 0.2);
}

function initGrid() {
  grid = [];
  for (let i = 0; i < COLS; i++) {
    grid[i] = [];
    for (let j = 0; j < ROWS; j++) {
      grid[i][j] = [];
      for (let k = 0; k < DEPTHS; k++) {
        const ox = (i - (COLS   - 1) / 2) * (cellSize + MARGIN);
        const oy = (j - (ROWS   - 1) / 2) * (cellSize + MARGIN);
        const oz = (k - (DEPTHS - 1) / 2) * (cellSize + MARGIN);
        grid[i][j][k] = {
          observed:           false,
          state:              0,
          noiseOffset:        random(1000),
          rotSpeed:           random(0.01, 0.04),
          finalRot:           createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
          currentPos:         createVector(ox, oy, oz),
          homePos:            createVector(ox, oy, oz),
          life:               0,
          shapeAtObservation: 0
        };
      }
    }
  }
}

// ---- 3D render ---------------------------------------------------------

function renderGridToBuffer() {
  pg.push();
  // Slow global rotation of the whole cluster (cosmetic, not user-driven)
  pg.rotateX(radians(frameCount * 0.1));
  pg.rotateY(radians(frameCount * 0.08));
  pg.rotateZ(radians(frameCount * 0.12));
  pg.ambientLight(80);
  pg.directionalLight(255, 255, 255, 0.5, 0.5, -1);

  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      for (let k = 0; k < DEPTHS; k++) {
        const cell = grid[i][j][k];

        // Age observed cells
        if (cell.observed) {
          cell.life--;
          if (cell.life <= 0) cell.observed = false;
        }

        // Drift back to home position
        cell.currentPos.x = lerp(cell.currentPos.x, cell.homePos.x, 0.08);
        cell.currentPos.y = lerp(cell.currentPos.y, cell.homePos.y, 0.08);
        cell.currentPos.z = lerp(cell.currentPos.z, cell.homePos.z, 0.08);

        pg.push();
        pg.rotateX(rotX);
        pg.rotateY(rotY);
        pg.translate(cell.currentPos.x, cell.currentPos.y, cell.currentPos.z);
        renderCell(cell, pg);
        pg.pop();
      }
    }
  }
  pg.pop();
}

function renderCell(cell, p) {
  if (!cell.observed) {
    // Quantum flux state: spinning wireframe box
    p.rotateX(frameCount * cell.rotSpeed);
    p.rotateY(frameCount * cell.rotSpeed * 1.1);
    p.noFill();
    p.stroke(100, 120);
    p.strokeWeight(1);
    p.box(cellSize * 0.4);
  } else {
    // Collapsed / observed state: solid geometry
    p.rotateX(cell.finalRot.x);
    p.rotateY(cell.finalRot.y);
    p.rotateZ(cell.finalRot.z);
    const alpha = cell.life < 40 ? map(cell.life, 0, 40, 0, 255) : 255;
    p.noStroke();
    p.fill(255, alpha);
    drawShape(p, cell.shapeAtObservation, alpha);
  }
}

function drawShape(p, mode, alpha) {
  p.fill(255, alpha);
  p.noStroke();
  switch (mode) {
    case 0: p.box(cellSize * 0.5);                                 break; // Box
    case 1: p.sphere(cellSize * 0.35, 8, 8);                      break; // Sphere
    case 2: p.torus(cellSize * 0.25, cellSize * 0.1, 12, 6);      break; // Torus
    case 3: p.cone(cellSize * 0.3, cellSize * 0.5, 8);            break; // Cone
    case 4: p.cylinder(cellSize * 0.2, cellSize * 0.45, 8);       break; // Cylinder
    default: p.box(cellSize * 0.5);
  }
}

// ---- Lowres dot grid ---------------------------------------------------

function drawDotGrid(halfH, displaySize) {
  const buffer   = pg.get();
  const tilesX   = int(map(mouseY, 0, height, 20, MAX_TILES));
  const tileSize = displaySize / tilesX;

  // Origin of the dot grid matches the ghost image below
  push();
  translate(width / 2 - displaySize / 2, halfH * 1.5 - displaySize / 2);
  noStroke();

  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesX; y++) {
      const sx = int(map(x, 0, tilesX, 0, buffer.width));
      const sy = int(map(y, 0, tilesX, 0, buffer.height));
      const c  = buffer.get(sx, sy);
      const b  = brightness(c);

      if (b > 15) {
        fill(min(b * 2, 255));
        const dotSize = map(b, 0, 255, 0, tileSize * 1.1);

        if (dotCircle) {
          // Circle mode (Day 4 Lowres style)
          ellipse(
            x * tileSize + tileSize * 0.5,
            y * tileSize + tileSize * 0.5,
            dotSize, dotSize
          );
        } else {
          // Square mode (Quantum original style)
          rect(x * tileSize, y * tileSize, dotSize, dotSize);
        }
      }
    }
  }
  pop();
}

// ---- UI labels ---------------------------------------------------------

function drawLabels(halfH, displaySize) {
  noStroke();
  textAlign(CENTER);

  fill(150);
  textSize(11);
  text("QUANTUM REALITY", width / 2, halfH - 15);
  text("DATA ABSTRACTION  (LOWRES)", width / 2, halfH + 18);

  // Bottom status bar
  fill(90);
  textSize(10);
  const shapeLabel = SHAPE_NAMES[shapeMode];
  const dotLabel   = dotCircle ? "CIRCLE" : "SQUARE";
  text(
    "SHAPE: " + shapeLabel +
    "   |   DOT: " + dotLabel +
    "   |   KEYS  1=BOX  2=SPHERE  3=TORUS  4=CONE  5=CYLINDER  P=DOT STYLE  R=RESET",
    width / 2,
    height - 10
  );
}

// ---- Interaction -------------------------------------------------------

function mouseMoved() {
  // Map mouse to grid coordinates (works for both halves)
  const yNorm = mouseY < height / 2
    ? mouseY / (height / 2)
    : (mouseY - height / 2) / (height / 2);

  const gx = floor(map(mouseX, 0, width, 0, COLS));
  const gy = floor(map(yNorm, 0, 1, 0, ROWS));

  for (let i = gx - 1; i <= gx + 1; i++) {
    for (let j = gy - 1; j <= gy + 1; j++) {
      if (i >= 0 && i < COLS && j >= 0 && j < ROWS) {
        const k    = floor(random(DEPTHS));
        const cell = grid[i][j][k];
        if (!cell.observed) {
          cell.observed           = true;
          cell.state              = random() > 0.5 ? 1 : 2;
          cell.shapeAtObservation = shapeMode; // snapshot active shape at moment of collapse
          cell.life               = floor(random(100, 250));
        }
      }
    }
  }
}

function keyPressed() {
  switch (key) {
    case '1': shapeMode = 0; break;
    case '2': shapeMode = 1; break;
    case '3': shapeMode = 2; break;
    case '4': shapeMode = 3; break;
    case '5': shapeMode = 4; break;
    case 'p':
    case 'P': dotCircle = !dotCircle; break;
    case 'r':
    case 'R': initGrid(); break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateLayout();
}