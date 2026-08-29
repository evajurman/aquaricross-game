import { drawButton } from "./drawButton";
import { drawLetter } from "./drawLetter";
import { getFrame } from "./utils";

export const mainMenuButtons = {
  play: { x: 0, y: 0, width: 0, height: 0 },
  settings: { x: 0, y: 0, width: 0, height: 0 },
};

export function drawMainMenu(ctx: CTX) {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  const letter = "Aquaricross!!".slice(0, (getFrame() * getFrame()) / 900);

  drawLetter({
    ctx,
    letter,
    pos: { x: 14, y: 42 },
    fontSize: 32,
    withStroke: true,
    bobble: true,
  });

  ctx.fillStyle = "black";
  ctx.strokeStyle = "";
  mainMenuButtons.play = drawButton({
    selected: window.gameStateMenu.selection === "Play",
    text: "Play",
    pos: { x: 60, y: 100 },
  });
  mainMenuButtons.settings = drawButton({
    selected: window.gameStateMenu.selection === "Settings",
    text: "Settings",
    pos: { x: 60, y: 128 },
  });
}
