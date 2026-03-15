/**
 * GENUARY 2026 - Day 4: Lowres. An image or graphic with low resolution, where details are simplified or pixelated.
 * Color: White (#FFFFFF)
 * Algorithm: Tiles
 */

let maxTiles = 100;
let tilesX, tilesY;
let tileW, tileH;

let pg;

function setup() {
  createCanvas(900, 900);
  pg = createGraphics(maxTiles, maxTiles, WEBGL);
}

function draw() {
  background(0);

  pg.push();
  pg.background(0);
  pg.noStroke();
  pg.ambientLight(80, 80, 80);
  pg.directionalLight(255, 255, 255, -1, 0, -1);

  pg.rotateX(radians(frameCount * 1.2));
  pg.rotateY(radians(frameCount * 0.5));
  pg.rotateZ(radians(frameCount * 1.5));

  pg.box(30, 80, 20);
  pg.pop();

  tilesX = int(map(mouseX, 0, width, 10, maxTiles));
  tilesY = tilesX;

  tileW = width / tilesX;
  tileH = height / tilesY;

  let buffer = pg.get();

  noStroke();
  fill(255);

  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {

      let sx = int(map(x, 0, tilesX, 0, buffer.width));
      let sy = int(map(y, 0, tilesY, 0, buffer.height));

      let c = buffer.get(sx, sy);
      let b = brightness(c);

      let dotSize = map(b, 0, 255, 0, tileW);

      ellipse(x * tileW, y * tileH, dotSize, dotSize);
    }
  }
	
  image(pg, 10, 10, 150, 150);
}
