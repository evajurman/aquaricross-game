export function drawBoard(ctx: CTX) {
  const boardOffsetX = 64;
  const boardOffsetY = 32;
  const cellSize = 10;
  const cellOffset = 1;
  const cellSquare = cellSize + cellOffset;

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
      ctx.strokeStyle = "black";
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
}
