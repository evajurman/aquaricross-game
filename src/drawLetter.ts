import { getFrame } from "./utils";

export function drawLetter({
  ctx,
  string,
  pos,
  fontFamily = "LuckiestGuy",
  fontSize,
  withStroke = false,
  noFill = false,
  bobble = false,
  vertical = false,
  deltaX = 0,
  deltaY = 0,
  animateIn = 0,
}: {
  ctx: CanvasRenderingContext2D;
  string: string;
  pos: Position;
  fontFamily?: string;
  fontSize: number;
  withStroke?: boolean;
  noFill?: boolean;
  bobble?: boolean;
  vertical?: boolean;
  deltaX?: number;
  deltaY?: number;
  animateIn?: number;
}) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  if (bobble) {
    let currentX = pos.x + ctx.measureText(string).width;
    let frame = getFrame();
    for (let char = string.length - 1; char >= 0; char--) {
      const frameDelta = (getFrame() * getFrame()) / 100;

      const modX = Math.max(0, (char + 1) * animateIn - frameDelta) * deltaX;
      const modY = Math.max(0, (char + 1) * animateIn - frameDelta) * deltaY;
      console.log();
      const stringWidth = vertical ? 0 : ctx.measureText(string[char]).width;
      const centerX = currentX;
      ctx.save();
      ctx.translate(
        centerX - stringWidth / 2 + modX,
        vertical ? fontSize * char * 0.55 + pos.y + modY : pos.y + modY,
      );

      const angle =
        Math.cos(Math.sin(((frame + char * 8) / 60) * (Math.PI / 4))) - 0.75;
      ctx.rotate(angle);
      if (withStroke) {
        ctx.strokeText(string[char], -stringWidth / 2, 0);
      }
      if (!noFill) {
        ctx.fillText(string[char], -stringWidth / 2, 0);
      }
      ctx.restore();
      currentX -= stringWidth;
    }
  } else {
    if (withStroke) {
      ctx.strokeText(string, pos.x, pos.y);
    }
    if (!noFill) {
      ctx.fillText(string, pos.x, pos.y);
    }
  }
}
