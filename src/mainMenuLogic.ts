import { mainMenuButtons } from "./mainMenu";
import { mousePos } from "./mouse";

export function updateMenu() {
  if (
    window.gameStateMenu.selection === null &&
    (window.input.p1.buttonDown || window.input.p1.buttonUp)
  ) {
    window.gameStateMenu.selection = "Play";
  }
  if (window.gameStateMenu.selection === "Play" && window.input.p1.buttonDown) {
    window.gameStateMenu.selection = "Settings";
  }
  if (
    window.gameStateMenu.selection === "Settings" &&
    window.input.p1.buttonUp
  ) {
    window.gameStateMenu.selection = "Play";
  }

  if (
    window.gameStateMenu.selection === "Play" &&
    window.input.p1.buttonSelect
  ) {
    window.gameState.screen = "Board";
  }

  if (
    window.gameStateMenu.selection === "Settings" &&
    window.input.p1.buttonSelect
  ) {
    window.gameState.screen = "Settings";
  }

  if (
    mousePos.x > mainMenuButtons.play.x &&
    mousePos.x < mainMenuButtons.play.x + mainMenuButtons.play.width &&
    mousePos.y > mainMenuButtons.play.y &&
    mousePos.y < mainMenuButtons.play.y + mainMenuButtons.play.height
  ) {
    window.gameStateMenu.selection = "Play";
  }

  if (
    mousePos.x > mainMenuButtons.settings.x &&
    mousePos.x < mainMenuButtons.settings.x + mainMenuButtons.settings.width &&
    mousePos.y > mainMenuButtons.settings.y &&
    mousePos.y < mainMenuButtons.settings.y + mainMenuButtons.settings.height
  ) {
    window.gameStateMenu.selection = "Settings";
  }
}
