import {
  delayAction,
  hasTuple,
  randomIndex,
  randomItem,
  removeTuple,
  uniqueTuples,
} from "./utils";

let builtBoard = false;
let paintMode: "fill" | "erase" | "cross" | null = null;

function getNeighbors(
  available: [number, number][],
  point: [number, number],
): [number, number][] {
  const deltas: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  return deltas
    .map(([dx, dy]): [number, number] => [point[0] + dx, point[1] + dy])
    .filter((p) => hasTuple(available, p));
}

function getRegionNeighbors(
  available: [number, number][],
  region: [number, number][],
): [number, number][] {
  const seen = new Set<string>();
  const result: [number, number][] = [];
  for (const cell of region) {
    for (const n of getNeighbors(available, cell)) {
      const key = `${n[0]},${n[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(n);
      }
    }
  }
  return result;
}

function buildTanks() {
  let availableTanks: [number, number][] = [];
  let tanks: [number, number][][] = [];
  // build available tanks
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      availableTanks.push([i, j]);
    }
  }
  for (let t = 0; t < 20; t++) {
    const tankIndex = randomIndex(availableTanks);
    const [tank] = availableTanks.splice(tankIndex, 1);
    tanks.push([tank]);
  }
  while (availableTanks.length > 0) {
    for (let i = 0; availableTanks.length > 0; i++) {
      i = i % tanks.length;
      const tank = tanks[i];
      const neighbors = getRegionNeighbors(availableTanks, tank);
      if (neighbors.length === 0) {
        continue; // this tank is boxed in, skip it this pass
      }
      const neighborToAdd = randomItem(neighbors);
      availableTanks = availableTanks.filter(
        (k) => !(k[0] === neighborToAdd[0] && k[1] === neighborToAdd[1]),
      );
      tank.push(neighborToAdd);
      tanks[i] = tank;
    }
  }

  window.gameStateBoard.tanks = tanks;
}

export function buildBoard() {
  buildTanks();

  const tanks = window.gameStateBoard.tanks;
  for (let tankIndex = 0; tankIndex < tanks.length; tankIndex++) {
    const tank = tanks[tankIndex];
    // random water level for each tank
    const [lowestWaterLevel, highestWaterLevel] = tank.reduce(
      ([lwl, hwl], square) => {
        return [Math.min(lwl, square[1]), Math.max(hwl, square[1])];
      },
      [Infinity, -1],
    );
    const waterLevel = Math.floor(
      Math.random() * (highestWaterLevel - lowestWaterLevel + 2),
    );
    for (let sIndex = 0; sIndex < tank.length; sIndex++) {
      const square = tank[sIndex];
      if (square[1] >= waterLevel + lowestWaterLevel) {
        window.gameStateBoard.solution.push(square);
      }
    }
  }
}

export function updateBoard() {
  if (!builtBoard && window.gameState.screen === "Board") {
    buildBoard();
    builtBoard = true;
    window.gameStateBoard.startTime = new Date();
  }

  if (window.input.p1.buttonShiftBoard) {
    delayAction((state) => {
      state.gameStateBoard.mode =
        state.gameStateBoard.mode === "Nonogram" ? "Aquarium" : "Nonogram";
    });
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

  let justPressedFilledButton =
    window.input.p1.buttonFillSquare &&
    !window.input.p1Previous.buttonFillSquare;

  if (justPressedFilledButton && paintMode === null) {
    paintMode = "erase"; // do not fill in the moment you go into the next screen
  } else if (justPressedFilledButton) {
    if (
      hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection)
    ) {
      paintMode = "erase";
    } else {
      paintMode = "fill";
    }
  }

  if (window.input.p1.buttonFillSquare) {
    if (paintMode === "erase") {
      window.gameStateBoard.fills = removeTuple(
        window.gameStateBoard.fills,
        window.gameStateBoard.selection,
      );
    }
    if (paintMode === "fill") {
      window.gameStateBoard.fills.push([...window.gameStateBoard.selection]);
      if (
        hasTuple(window.gameStateBoard.crosses, window.gameStateBoard.selection)
      ) {
        window.gameStateBoard.crosses = removeTuple(
          window.gameStateBoard.crosses,
          window.gameStateBoard.selection,
        );
      }
    }

    window.gameStateBoard.fills = uniqueTuples(window.gameStateBoard.fills);
  }

  let justPressedCrossButton =
    window.input.p1.buttonCrossSquare &&
    !window.input.p1Previous.buttonCrossSquare;

  if (justPressedCrossButton) {
    if (
      hasTuple(window.gameStateBoard.crosses, window.gameStateBoard.selection)
    ) {
      paintMode = "erase";
    } else {
      paintMode = "cross";
    }
  }

  if (window.input.p1.buttonCrossSquare) {
    if (paintMode === "erase") {
      window.gameStateBoard.crosses = removeTuple(
        window.gameStateBoard.crosses,
        window.gameStateBoard.selection,
      );
    }
    if (paintMode === "cross") {
      window.gameStateBoard.crosses.push([...window.gameStateBoard.selection]);
      if (
        hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection)
      ) {
        window.gameStateBoard.fills = removeTuple(
          window.gameStateBoard.fills,
          window.gameStateBoard.selection,
        );
      }
    }

    window.gameStateBoard.crosses = uniqueTuples(window.gameStateBoard.crosses);
  }
}
