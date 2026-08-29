import { getFrame } from "./utils";

export function drawLetter({
  ctx,
  letter,
  pos,
  fontFamily = "LuckiestGuy",
  fontSize,
  withStroke = false,
  noFill = false,
  bobble = false,
  vertical = false,
}: {
  ctx: CanvasRenderingContext2D;
  letter: string;
  pos: Position;
  fontFamily?: string;
  fontSize: number;
  withStroke?: boolean;
  noFill?: boolean;
  bobble?: boolean;
  vertical?: boolean;
}) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  if (bobble) {
    let currentX = pos.x + ctx.measureText(letter).width;
    let frame = getFrame();
    for (let char = letter.length - 1; char >= 0; char--) {
      const letterWidth = vertical ? 0 : ctx.measureText(letter[char]).width;
      const centerX = currentX;
      ctx.save();
      ctx.translate(
        centerX - letterWidth / 2,
        vertical ? fontSize * char * 0.55 + pos.y : pos.y + 0,
      );

      const angle =
        Math.cos(Math.sin(((frame + char * 8) / 60) * (Math.PI / 4))) - 0.75;
      ctx.rotate(angle);
      if (withStroke) {
        ctx.strokeText(letter[char], -letterWidth / 2, 0);
      }
      if (!noFill) {
        ctx.fillText(letter[char], -letterWidth / 2, 0);
      }
      ctx.restore();
      currentX -= letterWidth;
    }
  } else {
    if (withStroke) {
      ctx.strokeText(letter, pos.x, pos.y);
    }
    if (!noFill) {
      ctx.fillText(letter, pos.x, pos.y);
    }
  }
}
