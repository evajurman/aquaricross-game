import { getCanvas, getCtx } from "./utils";

const ctx = getCtx();
const canvas = getCanvas();

export function drawBackground(frame: number) {
  // background
  ctx.fillStyle = "#CF975E";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ca8139";
  const size = 18;
  const spacing = 25;
  const angle = (frame / 60) * (Math.PI / 2);

  for (let i = -1; i < 10; i++) {
    for (let j = -1; j < 9; j++) {
      ctx.fillStyle = `#ca81${j}${i}`;
      const centerX = i * spacing + size / 2;
      const centerY = j * spacing + size / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
}
