export function updateMenu() {
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
}
