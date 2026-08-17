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
}: {
  ctx: CanvasRenderingContext2D;
  letter: string;
  pos: Position;
  fontFamily?: string;
  fontSize: number;
  withStroke?: boolean;
  noFill?: boolean;
  bobble?: boolean;
}) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  if (bobble) {
    let currentX = pos.x;
    let frame = getFrame();
    for (let char = 0; char < letter.length; char++) {
      const letterWidth = ctx.measureText(letter[char]).width;
      const centerX = currentX - letterWidth / 4;
      ctx.save();
      ctx.translate(centerX + letterWidth - 2, pos.y + 0);

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
      currentX += letterWidth;
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
