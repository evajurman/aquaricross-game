import { drawBoard } from "./board";
import { updateBoard } from "./boardLogic";
import { drawMainMenu } from "./mainMenu";
import { updateMenu } from "./mainMenuLogic";
import { getCanvas, getCtx } from "./utils";

const ctx = getCtx();
const canvas = getCanvas();

export function drawSprites(frame: number) {
  // if menu draw menu
  if (window.gameState.screen === "Menu") {
    updateMenu();
    drawMainMenu(ctx);
  }
  if (window.gameState.screen === "Board") {
    // do other stuff
    updateBoard();
    drawBoard(ctx);
  }
}
