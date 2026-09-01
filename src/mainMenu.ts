import { drawButton } from "./drawButton";
import { drawLetter } from "./drawLetter";
import { getFrame } from "./utils";

export const mainMenuButtons = {
  play: { x: 0, y: 0, width: 0, height: 0 },
  settings: { x: 0, y: 0, width: 0, height: 0 },
};

export function drawMainMenu(ctx: CTX) {
  const selection = window.gameStateMenu.selection;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;

  drawLetter({
    ctx,
    string: "Aquaricross!!",
    pos: { x: 14, y: 42 },
    fontSize: 32,
    withStroke: true,
    bobble: true,
    deltaY: -10,
    animateIn: selection ? 0 : 10,
  });

  ctx.fillStyle = "black";
  ctx.strokeStyle = "";
  let animationEnd = ("Aquaricross!!".length + 1) * 9;
  if (getFrame() > animationEnd || selection) {
    mainMenuButtons.play = drawButton({
      selected: selection === "Play",
      text: "Play",
      pos: { x: 60, y: 100 },
    });
    mainMenuButtons.settings = drawButton({
      selected: selection === "Settings",
      text: "Settings",
      pos: { x: 60, y: 128 },
    });
  }
}
