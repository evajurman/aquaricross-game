import { getCanvas, getCtx } from "./utils";

const GBA_WIDTH = 240;
const GBA_HEIGHT = 160;

const canvas = getCanvas();
const ctx = getCtx();

export function resizeCanvas(): void {
  const rawScale = Math.min(
    window.innerWidth / GBA_WIDTH,
    window.innerHeight / GBA_HEIGHT,
  );
  const scale = Math.max(1, Math.floor(rawScale)); // integer scale, at least 1x

  canvas.style.width = `${GBA_WIDTH * scale}px`;
  canvas.style.height = `${GBA_HEIGHT * scale}px`;

  canvas.width = GBA_WIDTH;
  canvas.height = GBA_HEIGHT;

  canvas.style.imageRendering = "pixelated";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
