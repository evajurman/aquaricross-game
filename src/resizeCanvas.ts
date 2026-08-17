import { getCanvas, getCtx } from "./utils";

const GBA_WIDTH = 240;
const GBA_HEIGHT = 160;

const canvas = getCanvas();
const ctx = getCtx();

export function resizeCanvas(): void {
  const scale = Math.min(
    window.innerWidth / GBA_WIDTH,
    window.innerHeight / GBA_HEIGHT,
  );

  const cssWidth = GBA_WIDTH * scale;
  const cssHeight = GBA_HEIGHT * scale;

  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  // Backing store stays EXACTLY 240x160 — no DPR multiplier
  canvas.width = GBA_WIDTH;
  canvas.height = GBA_HEIGHT;

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Turn OFF smoothing so upscaling is nearest-neighbor
  ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
