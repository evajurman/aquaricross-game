import { drawLetter } from "./drawLetter";
import { getHHMMSSDifference, hasTuple } from "./utils";

const boardOffsetX = 86;
const boardOffsetY = 46;
const cellSize = 10;
const cellOffset = 1;
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
    ctx.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 1,
      cellSquare * 5 + 1,
      cellSquare * 5 + 1,
    );
    ctx.strokeRect(
      cellSquare * 5 + boardOffsetX - 1,
      boardOffsetY - 1,
      cellSquare * 5 + 1,
      cellSquare * 5 + 1,
    );
    ctx.strokeRect(
      boardOffsetX - 1,
      cellSquare * 5 + boardOffsetY - 1,
      cellSquare * 5 + 1,
      cellSquare * 5 + 1,
    );
    ctx.strokeRect(
      cellSquare * 5 + boardOffsetX - 1,
      cellSquare * 5 + boardOffsetY - 1,
      cellSquare * 5 + 1,
      cellSquare * 5 + 1,
    );
    ctx.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 1,
      cellSquare * 10 + 1,
      cellSquare * 10 + 1,
    );

    ctx.fillStyle = "black";

    for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
      const square = window.gameStateBoard.fills[i];
      ctx.beginPath();
      ctx.roundRect(
        boardOffsetX + square[0] * cellSquare + 2,
        boardOffsetY + square[1] * cellSquare + 2,
        cellSize - 4,
        cellSize - 4,
        2,
      );
      ctx.fill();
      ctx.closePath();
    }

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

  if (window.gameStateBoard.mode === "Aquarium") {
    drawAquariumHints(ctx);
    // render aquarium squares
    ctx.lineWidth = 1;
  }

  ctx.lineWidth = 2;
  const [cursorX, cursorY] = window.gameStateBoard.selection;
  ctx.strokeRect(
    boardOffsetX + cursorX * cellSquare,
    boardOffsetY + cursorY * cellSquare,
    cellSize,
    cellSize,
  );

  const time = getHHMMSSDifference(new Date(), window.gameStateBoard.startTime);
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
    drawLetter({
      ctx,
      letter: `${clueCount}`,
      pos: {
        x: boardOffsetX + i * cellSquare + 2,
        y: boardOffsetY - 3,
      },
      fontSize: clueCount === 10 ? 8 : 10,
    });
  }
  for (let i = 0; i < 10; i++) {
    const clueCount = window.gameStateBoard.solution.filter(
      (sqr) => sqr[1] === i,
    ).length;
    drawLetter({
      ctx,
      letter: `${clueCount}`,
      pos: {
        x: boardOffsetX - cellSquare + 2,
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
  for (let i = 0; i < 10; i++) {
    const clueArray = window.gameStateBoard.solution.reduce<{
      clues: number[];
    }>(
      (acc, sqr, index, array) => {
        const continued =
          index > 0
            ? array[index - 1][0] === i && array[index - 1][1] === sqr[1] - 1
            : false;
        if (sqr[0] === i && continued) {
          return {
            clues: [
              ...acc.clues.slice(0, acc.clues.length - 1),
              acc.clues[acc.clues.length - 1] + 1,
            ],
          };
        }
        if (sqr[0] === i && !continued) {
          return {
            clues: [...acc.clues, 1],
          };
        }
        return { ...acc };
      },
      { clues: [] },
    );
    if (clueArray.clues.length === 0) {
      clueArray.clues = [0];
    }
    for (let j = 0; j < clueArray.clues.length; j++) {
      const isTen =
        `${clueArray.clues[clueArray.clues.length - 1 - j]}` === "10";
      const fontSize = isTen ? 8 : 10;
      drawLetter({
        ctx,
        letter: `${clueArray.clues[clueArray.clues.length - 1 - j]}`,
        pos: {
          x: boardOffsetX + i * cellSquare + (isTen ? 1 : 3),
          y: boardOffsetY - j * (cellSquare / 1.2) - 3,
        },
        fontSize,
      });
    }
  }
  for (let i = 0; i < 10; i++) {
    const clueArray = window.gameStateBoard.solution.reduce<{
      clues: number[];
    }>(
      (acc, sqr, index, array) => {
        const continued =
          index > 0 ? hasTuple(array, [sqr[0] - 1, sqr[1]]) : false;
        if (sqr[1] === i && continued) {
          return {
            clues: [
              ...acc.clues.slice(0, acc.clues.length - 1),
              acc.clues[acc.clues.length - 1] + 1,
            ],
          };
        }
        if (sqr[1] === i && !continued) {
          return {
            clues: [...acc.clues, 1],
          };
        }
        return { ...acc };
      },
      { clues: [] },
    );
    for (let j = 0; j < clueArray.clues.length; j++) {
      drawLetter({
        ctx,
        letter: `${clueArray.clues[clueArray.clues.length - 1 - j]}`,
        pos: {
          x: boardOffsetX - j * (cellSquare / 1.2) - 8,
          y: boardOffsetY + i * cellSquare + 8,
        },
        fontSize: 10,
      });
    }
  }
}
