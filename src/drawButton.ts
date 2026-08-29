import { drawLetter } from "./drawLetter";
import { getCtx } from "./utils";

const ctx = getCtx();

export function drawButton({
  selected,
  text,
  pos,
  fontSize = 20,
}: {
  selected: boolean;
  text: string;
  pos: Position;
  fontSize?: number;
}) {
  ctx.beginPath();
  ctx.fillStyle = selected ? "black" : "white";
  const buttonWidth = ctx.measureText(text).width;
  ctx.roundRect(pos.x - 4, pos.y - fontSize, buttonWidth + 8, fontSize + 6, 10);
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = selected ? "white" : "black";
  drawLetter({
    ctx,
    letter: text,
    pos,
    fontSize,
    bobble: selected,
  });
  return {
    x: pos.x - 4,
    y: pos.y - fontSize,
    width: buttonWidth + 8,
    height: fontSize + 6,
  };
}
