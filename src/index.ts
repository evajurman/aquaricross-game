import { loadFonts } from "./loadFonts";
import { resizeCanvas } from "./resizeCanvas";
import { drawBackground } from "./background";
import { drawSprites } from "./sprites";

let frameNumber = 0;

window.gameState = {
  screen: "Board",
};
window.gameStateBoard = {
  mode: "Aquarium",
  selection: [0, 0],
  fills: [],
  crosses: [],
  solution: [],
  tanks: [],
  startTime: new Date(),
};
window.gameStateMenu = {
  selection: "Play",
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

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  resizeCanvas();

  window.requestAnimationFrame(tick);
}

document.addEventListener("keydown", (event) => {
  for (let inputKey of Object.keys(window.keySettings) as (keyof GameInput)[]) {
    if (window.keySettings[inputKey] === event.key) {
      window.input.p1Previous[inputKey] = false;
      window.input.p1[inputKey] = true;
    }
  }
});

document.addEventListener("keyup", (event) => {
  for (let inputKey of Object.keys(window.keySettings) as (keyof GameInput)[]) {
    if (window.keySettings[inputKey] === event.key) {
      window.input.p1[inputKey] = false;
      window.input.p1Previous[inputKey] = true;
    }
  }
});

start();
