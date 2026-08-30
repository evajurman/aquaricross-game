import { buttonsArray } from "./settings";
import { delayAction } from "./utils";

export let settingsSelection: number | null = null;
export let returnFromSettings = 0;

export function updateSettings() {
  delayAction(() => {
    if (window.input.p1.buttonUp) {
      settingsSelection =
        ((settingsSelection || buttonsArray.length) - 1) % buttonsArray.length;
    } else if (window.input.p1.buttonDown) {
      settingsSelection = ((settingsSelection || 0) + 1) % buttonsArray.length;
    }
  });

  if (window.input.p1.buttonBack) {
    returnFromSettings += 1;
  } else {
    returnFromSettings = 0;
  }

  if (returnFromSettings >= 100) {
    window.gameState.screen = "Menu";
  }
}
