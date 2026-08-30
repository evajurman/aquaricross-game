import { loadFonts } from "./loadFonts";
import { resizeCanvas } from "./resizeCanvas";
import { drawBackground } from "./background";
import { drawSprites } from "./sprites";
import { mousePos } from "./mouse";

let frameNumber = 0;

window.gameState = {
  screen: "Menu",
};
window.gameStateBoard = {
  mode: "Nonogram",
  selection: [0, 0],
  fills: [],
  crosses: [],
  solution: [],
  tanks: [],
  startTime: new Date(),
  endTime: undefined,
};
window.gameStateMenu = {
  selection: null,
};
window.input = {
  p1: {
    buttonDown: false,
    buttonLeft: false,
    buttonRight: false,
    buttonUp: false,
    buttonBack: false,
    buttonSelect: false,
    buttonCrossSquare: false,
    buttonFillSquare: false,
    buttonShiftBoard: false,
  },
  p1Previous: {
    buttonDown: false,
    buttonLeft: false,
    buttonRight: false,
    buttonUp: false,
    buttonBack: false,
    buttonSelect: false,
    buttonCrossSquare: false,
    buttonFillSquare: false,
    buttonShiftBoard: false,
  },
  p2: {
    buttonDown: false,
    buttonLeft: false,
    buttonRight: false,
    buttonUp: false,
    buttonBack: false,
    buttonSelect: false,
    buttonCrossSquare: false,
    buttonFillSquare: false,
    buttonShiftBoard: false,
  },
  p2Previous: {
    buttonDown: false,
    buttonLeft: false,
    buttonRight: false,
    buttonUp: false,
    buttonBack: false,
    buttonSelect: false,
    buttonCrossSquare: false,
    buttonFillSquare: false,
    buttonShiftBoard: false,
  },
};

window.keySettings = {
  buttonDown: "s",
  buttonLeft: "a",
  buttonRight: "d",
  buttonUp: "w",
  buttonSelect: "j",
  buttonBack: "k",
  buttonCrossSquare: "k",
  buttonFillSquare: "j",
  buttonShiftBoard: " ",
};

function tick(): void {
  frameNumber++;
  window.frameNumber = frameNumber;

  // snapshot this frame's state for next frame's comparison
  for (const inputKey of Object.keys(window.input.p1) as (keyof GameInput)[]) {
    window.input.p1Previous[inputKey] = window.input.p1[inputKey];
  }

  requestAnimationFrame(() => drawBackground(frameNumber));
  requestAnimationFrame(() => drawSprites(frameNumber));
  // requestAnimationFrame(() => drawUI(frameNumber));

  requestAnimationFrame(tick);
}

async function start() {
  await loadFonts();

  resizeCanvas();

  window.requestAnimationFrame(tick);
}

document.addEventListener("keydown", (event) => {
  mousePos.x = 260;
  mousePos.y = 180;
  for (let inputKey of Object.keys(window.keySettings) as (keyof GameInput)[]) {
    if (window.keySettings[inputKey] === event.key) {
      window.input.p1[inputKey] = true;
    }
  }
});

document.addEventListener("keyup", (event) => {
  for (let inputKey of Object.keys(window.keySettings) as (keyof GameInput)[]) {
    if (window.keySettings[inputKey] === event.key) {
      window.input.p1[inputKey] = false;
    }
  }
});

start();
