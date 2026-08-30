import { drawBoard } from "./board";
import { updateBoard } from "./boardLogic";
import { drawMainMenu } from "./mainMenu";
import { updateMenu } from "./mainMenuLogic";
import { drawMouse } from "./mouse";
import { drawSettings } from "./settings";
import { updateSettings } from "./settingsLogic";
import { getCanvas, getCtx } from "./utils";

const ctx = getCtx();
const canvas = getCanvas();

export function drawSprites(frame: number) {
  if (window.gameState.screen === "Menu") {
    updateMenu();
    drawMainMenu(ctx);
  }
  if (window.gameState.screen === "Board") {
    updateBoard();
    drawBoard(ctx);
  }
  if (window.gameState.screen === "Settings") {
    updateSettings();
    drawSettings(ctx);
  }

  drawMouse(ctx);
}
