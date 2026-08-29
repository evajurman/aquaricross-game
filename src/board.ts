import { drawLetter } from "./drawLetter";
import { testFills } from "./hint";
import { getHHMMSSDifference, hasTuple } from "./utils";

export const boardOffsetX = 86;
export const boardOffsetY = 46;
export const cellSize = 10;
export const cellOffset = 1;
const cellSquare = cellSize + cellOffset;

export function drawBoard(ctx: CTX) {
  ctx.fillStyle = "white";

  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.2;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ctx.fillRect(
        i * cellSquare + boardOffsetX,
        j * cellSquare + boardOffsetY,
        cellSize,
        cellSize,
      );
      ctx.strokeRect(
        i * cellSquare + boardOffsetX,
        j * cellSquare + boardOffsetY,
        cellSize,
        cellSize,
      );
    }
  }

  if (window.gameStateBoard.mode === "Nonogram") {
    drawNonogramHints(ctx);
    ctx.lineWidth = 1;

    // if picross, do 5x5
    ctx.strokeRect(boardOffsetX, boardOffsetY, cellSquare * 5, cellSquare * 5);
    ctx.strokeRect(
      cellSquare * 5 + boardOffsetX,
      boardOffsetY,
      cellSquare * 5,
      cellSquare * 5,
    );
    ctx.strokeRect(
      boardOffsetX,
      cellSquare * 5 + boardOffsetY,
      cellSquare * 5,
      cellSquare * 5,
    );
    ctx.strokeRect(
      cellSquare * 5 + boardOffsetX,
      cellSquare * 5 + boardOffsetY,
      cellSquare * 5,
      cellSquare * 5,
    );
    ctx.strokeRect(
      boardOffsetX,
      boardOffsetY,
      cellSquare * 10,
      cellSquare * 10,
    );
  }

  if (window.gameStateBoard.mode === "Aquarium") {
    drawAquariumHints(ctx);
    // render aquarium squares
    ctx.lineWidth = 1;

    for (
      let tIndex = 0;
      tIndex < window.gameStateBoard.tanks.length;
      tIndex++
    ) {
      const tank = window.gameStateBoard.tanks[tIndex];
      // for each region, go through each square,
      for (let squareIndex = 0; squareIndex < tank.length; squareIndex++) {
        // if the square does not have a neighbor in the same tank, draw a line there
        const [squareX, squareY] = tank[squareIndex];
        if (!hasTuple(tank, [squareX - 1, squareY])) {
          // draw line left
          ctx.beginPath();
          ctx.moveTo(
            boardOffsetX + squareX * cellSquare,
            boardOffsetY + squareY * cellSquare,
          );

          ctx.lineTo(
            boardOffsetX + squareX * cellSquare,
            boardOffsetY + (squareY + 1) * cellSquare,
          );
          ctx.closePath();
          ctx.stroke();
        }
        if (!hasTuple(tank, [squareX + 1, squareY])) {
          // draw line right
          ctx.beginPath();
          ctx.moveTo(
            boardOffsetX + (squareX + 1) * cellSquare,
            boardOffsetY + squareY * cellSquare,
          );

          ctx.lineTo(
            boardOffsetX + (squareX + 1) * cellSquare,
            boardOffsetY + (squareY + 1) * cellSquare,
          );
          ctx.closePath();
          ctx.stroke();
        }
        if (!hasTuple(tank, [squareX, squareY - 1])) {
          // draw line up
          ctx.beginPath();
          ctx.moveTo(
            boardOffsetX + squareX * cellSquare,
            boardOffsetY + squareY * cellSquare,
          );

          ctx.lineTo(
            boardOffsetX + (squareX + 1) * cellSquare,
            boardOffsetY + squareY * cellSquare,
          );
          ctx.closePath();
          ctx.stroke();
        }
        if (!hasTuple(tank, [squareX, squareY + 1])) {
          // draw line down
          ctx.beginPath();
          ctx.moveTo(
            boardOffsetX + squareX * cellSquare,
            boardOffsetY + (squareY + 1) * cellSquare,
          );

          ctx.lineTo(
            boardOffsetX + (squareX + 1) * cellSquare,
            boardOffsetY + (squareY + 1) * cellSquare,
          );
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = window.gameStateBoard.mode === "Nonogram" ? "blue" : "red";
  const [cursorX, cursorY] = window.gameStateBoard.selection;
  ctx.strokeRect(
    boardOffsetX + cursorX * cellSquare + 1,
    boardOffsetY + cursorY * cellSquare + 1,
    cellSize - 2,
    cellSize - 2,
  );

  ctx.fillStyle = "black";
  const time = getHHMMSSDifference(
    window.gameStateBoard.endTime || new Date(),
    window.gameStateBoard.startTime,
  );
  for (let i = 0; i < time.length; i++) {
    drawLetter({
      ctx,
      letter: `${time[i]}`,
      pos: {
        x: boardOffsetX - 42 + i * 8,
        y: boardOffsetY - 4,
      },
      fontSize: 10,
    });
  }

  drawFills(ctx);
  drawCrosses(ctx);

  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 4;
  if (window.gameStateBoard.mode === "Aquarium") {
    drawLetter({
      ctx,
      letter: "AQUARIUM",
      pos: { x: 52, y: 32 },
      fontSize: 32,
      withStroke: true,
      bobble: true,
      vertical: true,
    });
  }
  if (window.gameStateBoard.mode === "Nonogram") {
    drawLetter({
      ctx,
      letter: "NONOGRAM",
      pos: { x: 36, y: 32 },
      fontSize: 32,
      withStroke: true,
      bobble: true,
      vertical: true,
    });
  }
}

export function drawFills(ctx: CTX) {
  ctx.fillStyle =
    window.gameStateBoard.mode === "Nonogram" ? "black" : "#4d56ff";

  for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
    const square = window.gameStateBoard.fills[i];
    ctx.beginPath();
    ctx.roundRect(
      boardOffsetX + square[0] * cellSquare + 1,
      boardOffsetY + square[1] * cellSquare + 1,
      cellSize - 2,
      cellSize - 2,
      2,
    );
    ctx.fill();
    ctx.closePath();
  }
}

export function drawCrosses(ctx: CTX) {
  for (let i = 0; i < window.gameStateBoard.crosses.length; i++) {
    const square = window.gameStateBoard.crosses[i];
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#663500";
    ctx.moveTo(
      boardOffsetX + square[0] * cellSquare + 3,
      boardOffsetY + square[1] * cellSquare + 3,
    );

    ctx.lineTo(
      boardOffsetX + square[0] * cellSquare + 7,
      boardOffsetY + square[1] * cellSquare + 7,
    );
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      boardOffsetX + square[0] * cellSquare + 7,
      boardOffsetY + square[1] * cellSquare + 3,
    );

    ctx.lineTo(
      boardOffsetX + square[0] * cellSquare + 3,
      boardOffsetY + square[1] * cellSquare + 7,
    );
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "black";
  }
}

export function drawAquariumHints(ctx: CTX) {
  ctx.lineWidth = 2;
  // top hints
  ctx.fillStyle = "white";
  ctx.fillRect(
    boardOffsetX - 2,
    boardOffsetY - (3 * cellSquare) / 2,
    cellSquare * 10 + 3,
    (cellSquare * 3) / 2,
  );
  ctx.strokeRect(
    boardOffsetX - 1,
    boardOffsetY - (3 * cellSquare) / 2 - 0.5,
    cellSquare * 10 + 1,
    (cellSquare * 3) / 2 - 0.5,
  );
  ctx.fillRect(
    boardOffsetX - (4 * cellSquare) / 2,
    boardOffsetY - 2,
    (cellSquare * 4) / 2,
    cellSquare * 10 + 3,
  );
  ctx.strokeRect(
    boardOffsetX - (4 * cellSquare) / 2 - 1,
    boardOffsetY - 1,
    (cellSquare * 4) / 2,
    cellSquare * 10 + 1,
  );
  // draw hints for cols
  ctx.fillStyle = "black";
  for (let i = 0; i < 10; i++) {
    const clueCount = window.gameStateBoard.solution.filter(
      (sqr) => sqr[0] === i,
    ).length;
    const isTen = clueCount === 10;
    const fillCount = window.gameStateBoard.fills.filter(
      (sqr) => sqr[0] === i,
    ).length;
    const crossCount = window.gameStateBoard.crosses.filter(
      (sqr) => sqr[0] === i,
    ).length;
    if (fillCount === clueCount) {
      ctx.fillStyle = "gray";
    } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    drawLetter({
      ctx,
      letter: `${clueCount}`,
      pos: {
        x: boardOffsetX + i * cellSquare + (isTen ? 0 : 3),
        y: boardOffsetY - 3,
      },
      fontSize: isTen ? 8 : 10,
    });
  }
  for (let i = 0; i < 10; i++) {
    const clueCount = window.gameStateBoard.solution.filter(
      (sqr) => sqr[1] === i,
    ).length;
    const fillCount = window.gameStateBoard.fills.filter(
      (sqr) => sqr[1] === i,
    ).length;
    const crossCount = window.gameStateBoard.crosses.filter(
      (sqr) => sqr[1] === i,
    ).length;
    if (fillCount === clueCount) {
      ctx.fillStyle = "gray";
    } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    drawLetter({
      ctx,
      letter: `${clueCount}`,
      pos: {
        x: boardOffsetX - cellSquare + (clueCount === 10 ? -3 : 2),
        y: boardOffsetY + i * cellSquare + 8,
      },
      fontSize: 10,
    });
  }
}

export function drawNonogramHints(ctx: CTX) {
  ctx.lineWidth = 2;
  // top hints
  ctx.fillStyle = "white";
  ctx.fillRect(
    boardOffsetX - 2,
    boardOffsetY - (6 * cellSquare) / 2 - 8,
    cellSquare * 10 + 3,
    (cellSquare * 6) / 2 + 8,
  );
  ctx.strokeRect(
    boardOffsetX - 1,
    boardOffsetY - (6 * cellSquare) / 2 - 9,
    cellSquare * 10 + 1,
    (cellSquare * 6) / 2 + 8,
  );
  // side hints
  ctx.fillRect(
    boardOffsetX - (8 * cellSquare) / 2,
    boardOffsetY - 2,
    (cellSquare * 8) / 2,
    cellSquare * 10 + 3,
  );
  ctx.strokeRect(
    boardOffsetX - (8 * cellSquare) / 2 - 1,
    boardOffsetY - 1,
    (cellSquare * 8) / 2,
    cellSquare * 10 + 1,
  );

  // draw hints for cols
  ctx.fillStyle = "black";

  let currentColFills: string[] = [];
  for (let i = 0; i < 10; i++) {
    currentColFills[i] = "";
    for (let j = 0; j < 10; j++) {
      if (hasTuple(window.gameStateBoard.fills, [i, j])) {
        currentColFills[i] = currentColFills[i].concat("f");
      } else if (hasTuple(window.gameStateBoard.crosses, [i, j])) {
        currentColFills[i] = currentColFills[i].concat("x");
      } else {
        currentColFills[i] = currentColFills[i].concat("e");
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    let clueArray: { clues: number[] } = { clues: [] };
    let continued = false;
    for (let j = 0; j < 10; j++) {
      if (hasTuple(window.gameStateBoard.solution, [i, j])) {
        if (!continued) {
          clueArray.clues.push(1);
        }
        if (continued) {
          clueArray.clues[clueArray.clues.length - 1] =
            clueArray.clues[clueArray.clues.length - 1] + 1;
        }
        continued = true;
      } else {
        continued = false;
      }
    }

    if (clueArray.clues.length === 0) {
      clueArray.clues = [0];
    }

    let fillStringMatchArray = (currentColFills[i].match(/f+/g) || []).map(
      (m) => m.length,
    );
    fillStringMatchArray =
      fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
    const isFillMatch = testFills(clueArray.clues, fillStringMatchArray);
    for (let j = 0; j < clueArray.clues.length; j++) {
      const clue = clueArray.clues[clueArray.clues.length - 1 - j];
      const isTen = clue === 10;

      if (isFillMatch[j]) {
        ctx.fillStyle = "gray";
      } else {
        ctx.fillStyle = "black";
      }
      drawLetter({
        ctx,
        letter: `${clue}`,
        pos: {
          x: boardOffsetX + i * cellSquare + (isTen ? 0 : 3),
          y: boardOffsetY - j * (cellSquare / 1.2) - 3,
        },
        fontSize: isTen ? 8 : 10,
      });
    }
  }

  let currentRowFills: string[] = [];
  for (let i = 0; i < 10; i++) {
    currentRowFills[i] = "";
    for (let j = 0; j < 10; j++) {
      if (hasTuple(window.gameStateBoard.fills, [j, i])) {
        currentRowFills[i] = "f".concat(currentRowFills[i]);
      } else if (hasTuple(window.gameStateBoard.crosses, [j, i])) {
        currentRowFills[i] = "x".concat(currentRowFills[i]);
      } else {
        currentRowFills[i] = "e".concat(currentRowFills[i]);
      }
    }
  }

  let currentRowSolution: string[] = [];
  for (let i = 0; i < 10; i++) {
    currentRowSolution[i] = "";
    for (let j = 0; j < 10; j++) {
      if (hasTuple(window.gameStateBoard.solution, [j, i])) {
        currentRowSolution[i] = "s".concat(currentRowSolution[i]);
      } else {
        currentRowSolution[i] = "e".concat(currentRowSolution[i]);
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    let hintStringMatchArray = (currentRowSolution[i].match(/s+/g) || []).map(
      (m) => m.length,
    );
    let fillStringMatchArray = (currentRowFills[i].match(/f+/g) || []).map(
      (m) => m.length,
    );
    hintStringMatchArray =
      hintStringMatchArray.length === 0 ? [0] : hintStringMatchArray;
    fillStringMatchArray =
      fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
    const isFillMatch = testFills(hintStringMatchArray, fillStringMatchArray);
    for (let j = 0; j < hintStringMatchArray.length; j++) {
      const clue = hintStringMatchArray[j];
      const isTen = clue === 10;
      if (isFillMatch[j]) {
        ctx.fillStyle = "gray";
      } else {
        ctx.fillStyle = "black";
      }
      drawLetter({
        ctx,
        letter: `${clue}`,
        pos: {
          x: boardOffsetX - j * (cellSquare / 1.2) - (isTen ? 14 : 9),
          y: boardOffsetY + i * cellSquare + 8,
        },
        fontSize: 10,
      });
    }
  }
}
