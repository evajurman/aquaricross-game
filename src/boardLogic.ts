import {
  delayAction,
  getFrame,
  hasTuple,
  removeTuple,
  uniqueTuples,
} from "./utils";

let shouldClearSquares = false;
let shouldClearCrosses = false;
let builtBoard = false;

export function buildBoard() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (Math.random() >= 0.5) {
        window.gameStateBoard.solution.push([i, j]);
      }
    }
  }
}

export function updateBoard() {
  if (!builtBoard && window.gameState.screen === "Board") {
    buildBoard();
    console.log(window.gameStateBoard.solution);
    builtBoard = true;
    window.gameStateBoard.startTime = new Date();
  }

  if (window.input.p1.buttonShiftBoard) {
    delayAction((state) => {
      state.gameStateBoard.mode =
        state.gameStateBoard.mode === "Nonogram" ? "Aquarium" : "Nonogram";
    }, 10);
  }

  // diagonal movements
  if (window.input.p1.buttonRight && window.input.p1.buttonUp) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.min(
        state.gameStateBoard.selection[0] + 1,
        9,
      );
      state.gameStateBoard.selection[1] = Math.max(
        state.gameStateBoard.selection[1] - 1,
        0,
      );
    });
  }
  if (window.input.p1.buttonRight && window.input.p1.buttonDown) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.min(
        state.gameStateBoard.selection[0] + 1,
        9,
      );
      state.gameStateBoard.selection[1] = Math.min(
        state.gameStateBoard.selection[1] + 1,
        9,
      );
    });
  }
  if (window.input.p1.buttonLeft && window.input.p1.buttonUp) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.max(
        state.gameStateBoard.selection[0] - 1,
        0,
      );
      state.gameStateBoard.selection[1] = Math.max(
        state.gameStateBoard.selection[1] - 1,
        0,
      );
    });
  }
  if (window.input.p1.buttonLeft && window.input.p1.buttonDown) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.max(
        state.gameStateBoard.selection[0] - 1,
        0,
      );
      state.gameStateBoard.selection[1] = Math.min(
        state.gameStateBoard.selection[1] + 1,
        9,
      );
    });
  }

  if (window.input.p1.buttonRight) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.min(
        state.gameStateBoard.selection[0] + 1,
        9,
      );
    });
  }
  if (window.input.p1.buttonLeft) {
    delayAction((state) => {
      state.gameStateBoard.selection[0] = Math.max(
        state.gameStateBoard.selection[0] - 1,
        0,
      );
    });
  }
  if (window.input.p1.buttonDown) {
    delayAction((state) => {
      state.gameStateBoard.selection[1] = Math.min(
        state.gameStateBoard.selection[1] + 1,
        9,
      );
    });
  }
  if (window.input.p1.buttonUp) {
    delayAction((state) => {
      state.gameStateBoard.selection[1] = Math.max(
        state.gameStateBoard.selection[1] - 1,
        0,
      );
    });
  }

  if (!window.input.p1.buttonFillSquare) {
    shouldClearSquares = false;
  }

  if (window.input.p1.buttonFillSquare) {
    // should remove squares
    shouldClearSquares =
      (hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection) &&
        window.input.p1.buttonFillSquare !==
          window.input.p1Previous.buttonFillSquare) ||
      (shouldClearSquares &&
        window.input.p1.buttonFillSquare ===
          window.input.p1Previous.buttonFillSquare);

    if (shouldClearSquares) {
      window.gameStateBoard.fills = removeTuple(
        window.gameStateBoard.fills,
        window.gameStateBoard.selection,
      );
    } else {
      window.gameStateBoard.fills.push([...window.gameStateBoard.selection]);
    }

    window.gameStateBoard.fills = uniqueTuples(window.gameStateBoard.fills);
  }

  if (!window.input.p1.buttonCrossSquare) {
    shouldClearCrosses = false;
  }

  if (window.input.p1.buttonCrossSquare) {
    // should remove squares
    shouldClearCrosses =
      (hasTuple(
        window.gameStateBoard.crosses,
        window.gameStateBoard.selection,
      ) &&
        window.input.p1.buttonCrossSquare !==
          window.input.p1Previous.buttonCrossSquare) ||
      (shouldClearCrosses &&
        window.input.p1.buttonCrossSquare ===
          window.input.p1Previous.buttonCrossSquare);

    if (shouldClearCrosses) {
      window.gameStateBoard.crosses = removeTuple(
        window.gameStateBoard.crosses,
        window.gameStateBoard.selection,
      );
    } else {
      window.gameStateBoard.crosses.push([...window.gameStateBoard.selection]);
    }

    window.gameStateBoard.crosses = uniqueTuples(window.gameStateBoard.crosses);
  }
}
