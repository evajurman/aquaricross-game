import { drawButton } from "./drawButton";
import { drawLetter } from "./drawLetter";
import { getCanvas } from "./utils";

const canvas = getCanvas();

export function drawMainMenu(ctx: CTX) {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  drawLetter({
    ctx,
    letter: "Aquaricross",
    pos: { x: 16, y: 42 },
    fontSize: 34,
    withStroke: true,
    bobble: true,
  });

  ctx.fillStyle = "black";
  ctx.strokeStyle = "";
  drawButton({
    selected: window.gameStateMenu.selection === "Play",
    text: "Play",
    pos: { x: 60, y: 100 },
  });
  drawButton({
    selected: window.gameStateMenu.selection === "Settings",
    text: "Settings",
    pos: { x: 60, y: 128 },
  });
}
