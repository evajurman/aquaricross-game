"use strict";
(() => {
  // src/loadFonts.ts
  var LuckiestGuyFont = new FontFace(
    "LuckiestGuy",
    "url(./fonts/LuckiestGuy-Regular.ttf)"
  );
  function loadFonts() {
    return LuckiestGuyFont.load().then(function(loadedFont) {
      document.fonts.add(loadedFont);
    }).catch(function(error) {
      console.error("Font failed to load:", error);
    });
  }

  // src/utils.ts
  function getCtx() {
    const canvas5 = document.getElementById("canvas");
    const ctx5 = canvas5.getContext("2d");
    return ctx5;
  }
  function getCanvas() {
    const canvas5 = document.getElementById("canvas");
    return canvas5;
  }
  function getFrame() {
    return window.frameNumber;
  }
  var delay = 0;
  function delayAction(callback, delayLength = 6) {
    if (delay === 0 || !(delay + delayLength > window.frameNumber)) {
      callback(window);
      delay = window.frameNumber;
    }
  }
  function uniqueTuples(list) {
    const uniqueTuples2 = Array.from(
      new Set(list.map((tuple) => JSON.stringify(tuple)))
    ).map((str) => JSON.parse(str));
    return uniqueTuples2;
  }
  function hasTuple(list, item) {
    return list.length === uniqueTuples([...list, item]).length;
  }
  function removeTuple(list, item) {
    return list.filter((i) => {
      if (JSON.stringify(i) === JSON.stringify(item)) {
        return false;
      }
      return true;
    });
  }
  function getHHMMSSDifference(date1, date2) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    const totalSeconds = Math.floor(diffInMs / 1e3);
    const overNintyNineMinutes = totalSeconds >= 5940;
    const minutes = Math.floor(totalSeconds % 5940 / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    if (overNintyNineMinutes) {
      return "99:99";
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }
  function randomIndex(list) {
    return Math.floor(Math.random() * list.length);
  }
  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // src/resizeCanvas.ts
  var GBA_WIDTH = 240;
  var GBA_HEIGHT = 160;
  var canvas = getCanvas();
  var ctx = getCtx();
  function resizeCanvas() {
    const rawScale = Math.min(
      window.innerWidth / GBA_WIDTH,
      window.innerHeight / GBA_HEIGHT
    );
    const scale = Math.max(1, Math.floor(rawScale));
    canvas.style.width = `${GBA_WIDTH * scale}px`;
    canvas.style.height = `${GBA_HEIGHT * scale}px`;
    canvas.width = GBA_WIDTH;
    canvas.height = GBA_HEIGHT;
    canvas.style.imageRendering = "pixelated";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // src/background.ts
  var ctx2 = getCtx();
  var canvas2 = getCanvas();
  function drawBackground(frame) {
    ctx2.fillStyle = "#CF975E";
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.fillStyle = "#ca8139";
    const size = 18;
    const spacing = 25;
    const angle = frame / 60 * (Math.PI / 2);
    for (let i = -1; i < 10; i++) {
      for (let j = -1; j < 9; j++) {
        ctx2.fillStyle = `#ca81${j}${i}`;
        const centerX = i * spacing + size / 2;
        const centerY = j * spacing + size / 2;
        ctx2.save();
        ctx2.translate(centerX, centerY);
        ctx2.rotate(angle);
        ctx2.fillRect(-size / 2, -size / 2, size, size);
        ctx2.restore();
      }
    }
  }

  // src/drawLetter.ts
  function drawLetter({
    ctx: ctx5,
    string,
    pos,
    fontFamily = "LuckiestGuy",
    fontSize,
    withStroke = false,
    noFill = false,
    bobble = false,
    vertical = false,
    deltaX = 0,
    deltaY = 0,
    animateIn = 0
  }) {
    ctx5.font = `${fontSize}px ${fontFamily}`;
    if (bobble) {
      let currentX = pos.x + ctx5.measureText(string).width;
      let frame = getFrame();
      for (let char = string.length - 1; char >= 0; char--) {
        const frameDelta = getFrame() * getFrame() / 100;
        const modX = Math.max(0, (char + 1) * animateIn - frameDelta) * deltaX;
        const modY = Math.max(0, (char + 1) * animateIn - frameDelta) * deltaY;
        console.log();
        const stringWidth = vertical ? 0 : ctx5.measureText(string[char]).width;
        const centerX = currentX;
        ctx5.save();
        ctx5.translate(
          centerX - stringWidth / 2 + modX,
          vertical ? fontSize * char * 0.55 + pos.y + modY : pos.y + modY
        );
        const angle = Math.cos(Math.sin((frame + char * 8) / 60 * (Math.PI / 4))) - 0.75;
        ctx5.rotate(angle);
        if (withStroke) {
          ctx5.strokeText(string[char], -stringWidth / 2, 0);
        }
        if (!noFill) {
          ctx5.fillText(string[char], -stringWidth / 2, 0);
        }
        ctx5.restore();
        currentX -= stringWidth;
      }
    } else {
      if (withStroke) {
        ctx5.strokeText(string, pos.x, pos.y);
      }
      if (!noFill) {
        ctx5.fillText(string, pos.x, pos.y);
      }
    }
  }

  // src/hint.ts
  function testFills(hints, fills) {
    const result = hints.map((__, i) => {
      return hints[i] === fills[i];
    });
    if (result.every(Boolean)) {
      return result;
    } else {
      return hints.map(() => false);
    }
  }

  // src/mouse.ts
  var mousePos = { x: 200, y: 200 };
  var canvas3 = getCanvas();
  function updatePos(event) {
    const rect = canvas3.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;
    mousePos.x = cssX * (canvas3.width / rect.width);
    mousePos.y = cssY * (canvas3.height / rect.height);
  }
  function drawMouse(ctx5) {
    ctx5.strokeStyle = "#9f2f1e";
    ctx5.fillStyle = "#ffc800";
    ctx5.lineWidth = 3;
    ctx5.beginPath();
    ctx5.moveTo(mousePos.x, mousePos.y);
    ctx5.lineTo(mousePos.x + 7, mousePos.y + 6);
    ctx5.lineTo(mousePos.x + 3, mousePos.y + 7);
    ctx5.lineTo(mousePos.x, mousePos.y + 10);
    ctx5.lineTo(mousePos.x, mousePos.y);
    ctx5.closePath();
    ctx5.stroke();
    ctx5.fill();
  }
  var pointerMode = "fill";
  document.addEventListener("pointermove", updatePos);
  document.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    updatePos(event);
    const mouseInBoardX = mousePos.x > boardOffsetX && mousePos.x < boardOffsetX + (cellSize + cellOffset) * 11;
    const mouseInBoardY = mousePos.y > boardOffsetY && mousePos.y < boardOffsetY + (cellSize + cellOffset) * 11;
    const mouseInBoard = mouseInBoardX && mouseInBoardY;
    if (window.gameState.screen === "Board" && event.button === 0 && mouseInBoard) {
      if (pointerMode === "fill") {
        window.input.p1.buttonFillSquare = true;
      }
      if (pointerMode === "cross") {
        window.input.p1.buttonCrossSquare = true;
      }
    }
    if (window.gameState.screen === "Board" && event.button === 2 && mouseInBoard) {
      if (pointerMode === "fill") {
        window.input.p1.buttonCrossSquare = true;
      }
      if (pointerMode === "cross") {
        window.input.p1.buttonFillSquare = true;
      }
    }
    const isInPointerModeSection = mousePos.x > 40 && mousePos.y > 9 && mousePos.x < 70 && mousePos.y < 31;
    if (window.gameState.screen === "Board" && isInPointerModeSection) {
      pointerMode = pointerMode === "fill" ? "cross" : "fill";
    }
    const isInBoardTypeSection = mousePos.x > 200 && mousePos.y > 7 && mousePos.x < 230 && mousePos.y < 156;
    if (isInBoardTypeSection) {
      window.input.p1.buttonShiftBoard = true;
    }
    window.input.p1.buttonSelect = true;
  });
  document.addEventListener("pointerup", (event) => {
    event.preventDefault();
    updatePos(event);
    if (window.gameState.screen === "Board" && event.button === 0) {
      if (pointerMode === "fill") {
        window.input.p1.buttonFillSquare = false;
      }
      if (pointerMode === "cross") {
        window.input.p1.buttonCrossSquare = false;
      }
    }
    if (window.gameState.screen === "Board" && event.button === 2) {
      if (pointerMode === "fill") {
        window.input.p1.buttonCrossSquare = false;
      }
      if (pointerMode === "cross") {
        window.input.p1.buttonFillSquare = false;
      }
    }
    const isInBoardTypeSection = mousePos.x > 200 && mousePos.y > 7 && mousePos.x < 230 && mousePos.y < 156;
    if (isInBoardTypeSection) {
      window.input.p1.buttonShiftBoard = false;
    }
    window.input.p1.buttonSelect = false;
  });
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // src/board.ts
  var boardOffsetX = 86;
  var boardOffsetY = 46;
  var cellSize = 10;
  var cellOffset = 1;
  var cellSquare = cellSize + cellOffset;
  var drawingCells = {};
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      drawingCells[`${i}_${j}`] = 0;
    }
  }
  function drawBoard(ctx5) {
    ctx5.fillStyle = "white";
    ctx5.strokeStyle = "black";
    ctx5.lineWidth = 0.2;
    for (let key in drawingCells) {
      drawingCells[key] = Math.max(0, drawingCells[key] - 1);
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ctx5.fillRect(
          i * cellSquare + boardOffsetX,
          j * cellSquare + boardOffsetY,
          cellSize,
          cellSize
        );
        ctx5.strokeRect(
          i * cellSquare + boardOffsetX,
          j * cellSquare + boardOffsetY,
          cellSize,
          cellSize
        );
      }
    }
    if (window.gameStateBoard.mode === "Nonogram") {
      drawNonogramHints(ctx5);
      ctx5.lineWidth = 1;
      ctx5.strokeRect(boardOffsetX, boardOffsetY, cellSquare * 5, cellSquare * 5);
      ctx5.strokeRect(
        cellSquare * 5 + boardOffsetX,
        boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx5.strokeRect(
        boardOffsetX,
        cellSquare * 5 + boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx5.strokeRect(
        cellSquare * 5 + boardOffsetX,
        cellSquare * 5 + boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx5.strokeRect(
        boardOffsetX,
        boardOffsetY,
        cellSquare * 10,
        cellSquare * 10
      );
    }
    if (window.gameStateBoard.mode === "Aquarium") {
      drawAquariumHints(ctx5);
      ctx5.lineWidth = 1;
      for (let tIndex = 0; tIndex < window.gameStateBoard.tanks.length; tIndex++) {
        const tank = window.gameStateBoard.tanks[tIndex];
        for (let squareIndex = 0; squareIndex < tank.length; squareIndex++) {
          const [squareX, squareY] = tank[squareIndex];
          if (!hasTuple(tank, [squareX - 1, squareY])) {
            ctx5.beginPath();
            ctx5.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx5.lineTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx5.closePath();
            ctx5.stroke();
          }
          if (!hasTuple(tank, [squareX + 1, squareY])) {
            ctx5.beginPath();
            ctx5.moveTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx5.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx5.closePath();
            ctx5.stroke();
          }
          if (!hasTuple(tank, [squareX, squareY - 1])) {
            ctx5.beginPath();
            ctx5.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx5.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx5.closePath();
            ctx5.stroke();
          }
          if (!hasTuple(tank, [squareX, squareY + 1])) {
            ctx5.beginPath();
            ctx5.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx5.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx5.closePath();
            ctx5.stroke();
          }
        }
      }
    }
    ctx5.lineWidth = 1;
    ctx5.strokeStyle = window.gameStateBoard.mode === "Nonogram" ? "blue" : "red";
    const [cursorX, cursorY] = window.gameStateBoard.selection;
    ctx5.strokeRect(
      boardOffsetX + cursorX * cellSquare + 1,
      boardOffsetY + cursorY * cellSquare + 1,
      cellSize - 2,
      cellSize - 2
    );
    ctx5.fillStyle = "black";
    const time = getHHMMSSDifference(
      window.gameStateBoard.endTime || /* @__PURE__ */ new Date(),
      window.gameStateBoard.startTime
    );
    if (window.gameStateBoard.endTime) {
      ctx5.fillStyle = "#ffe100";
    } else {
      ctx5.fillStyle = "black";
    }
    for (let i = 0; i < time.length; i++) {
      drawLetter({
        ctx: ctx5,
        string: `${time[i]}`,
        pos: {
          x: boardOffsetX - 42 + i * 8,
          y: boardOffsetY - 4
        },
        fontSize: 10
      });
    }
    drawPointerMode(ctx5);
    drawFills(ctx5);
    drawCrosses(ctx5);
    ctx5.strokeStyle = "black";
    ctx5.fillStyle = "white";
    ctx5.lineWidth = 4;
    if (window.gameStateBoard.mode === "Aquarium") {
      drawLetter({
        ctx: ctx5,
        string: "AQUARIUM",
        pos: { x: 52, y: 32 },
        fontSize: 32,
        withStroke: true,
        bobble: true,
        vertical: true
      });
    }
    if (window.gameStateBoard.mode === "Nonogram") {
      drawLetter({
        ctx: ctx5,
        string: "NONOGRAM",
        pos: { x: 36, y: 32 },
        fontSize: 32,
        withStroke: true,
        bobble: true,
        vertical: true
      });
    }
  }
  function drawPointerMode(ctx5) {
    if (pointerMode === "cross") {
      ctx5.fillStyle = "white";
      ctx5.strokeStyle = "black";
      ctx5.lineWidth = 2;
      ctx5.fillRect(52, 14, 14, 14);
      ctx5.strokeRect(52, 14, 14, 14);
      ctx5.fillStyle = "black";
      ctx5.beginPath();
      ctx5.roundRect(54, 16, 10, 10, 2);
      ctx5.fill();
      ctx5.fillStyle = "white";
      ctx5.strokeStyle = "black";
      ctx5.lineWidth = 2;
      ctx5.fillRect(45, 10, 14, 14);
      ctx5.strokeRect(45, 10, 14, 14);
      ctx5.fillStyle = "black";
      ctx5.beginPath();
      ctx5.beginPath();
      ctx5.lineWidth = 3;
      ctx5.strokeStyle = "#663500";
      ctx5.moveTo(48, 13);
      ctx5.lineTo(56, 21);
      ctx5.closePath();
      ctx5.stroke();
      ctx5.beginPath();
      ctx5.moveTo(56, 13);
      ctx5.lineTo(48, 21);
      ctx5.closePath();
      ctx5.stroke();
      ctx5.fill();
    }
    if (pointerMode === "fill") {
      ctx5.fillStyle = "white";
      ctx5.strokeStyle = "black";
      ctx5.lineWidth = 2;
      ctx5.fillRect(45, 10, 14, 14);
      ctx5.strokeRect(45, 10, 14, 14);
      ctx5.fillStyle = "black";
      ctx5.beginPath();
      ctx5.beginPath();
      ctx5.lineWidth = 3;
      ctx5.strokeStyle = "#663500";
      ctx5.moveTo(48, 13);
      ctx5.lineTo(56, 21);
      ctx5.closePath();
      ctx5.stroke();
      ctx5.beginPath();
      ctx5.moveTo(56, 13);
      ctx5.lineTo(48, 21);
      ctx5.closePath();
      ctx5.stroke();
      ctx5.fill();
      ctx5.fillStyle = "white";
      ctx5.strokeStyle = "black";
      ctx5.lineWidth = 2;
      ctx5.fillRect(52, 14, 14, 14);
      ctx5.strokeRect(52, 14, 14, 14);
      ctx5.fillStyle = "black";
      ctx5.beginPath();
      ctx5.roundRect(54, 16, 10, 10, 2);
      ctx5.fill();
    }
  }
  function drawFills(ctx5) {
    ctx5.fillStyle = window.gameStateBoard.mode === "Nonogram" ? "black" : "#b48700";
    for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
      const square = window.gameStateBoard.fills[i];
      const anim = drawingCells[`${square[0]}_${square[1]}`] / 10;
      ctx5.beginPath();
      ctx5.roundRect(
        boardOffsetX + square[0] * cellSquare + 1 + 2 * anim,
        boardOffsetY + square[1] * cellSquare + 1 + 2 * anim,
        cellSize - 2 - 4 * anim,
        cellSize - 2 - 4 * anim,
        2
      );
      ctx5.fill();
      ctx5.closePath();
    }
  }
  function drawCrosses(ctx5) {
    for (let i = 0; i < window.gameStateBoard.crosses.length; i++) {
      const square = window.gameStateBoard.crosses[i];
      const anim = drawingCells[`${square[0]}_${square[1]}`] / 5;
      const anim1 = Math.max(0, anim * 2);
      const anim2 = Math.max(Math.min(anim - 0.5, 1), 0);
      ctx5.beginPath();
      ctx5.lineWidth = 1.5;
      ctx5.strokeStyle = "#663500";
      ctx5.moveTo(
        boardOffsetX + square[0] * cellSquare + 3,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx5.lineTo(
        boardOffsetX + square[0] * cellSquare + 7 - 2 * anim1,
        boardOffsetY + square[1] * cellSquare + 7 - 2 * anim1
      );
      ctx5.closePath();
      ctx5.stroke();
      ctx5.beginPath();
      ctx5.moveTo(
        boardOffsetX + square[0] * cellSquare + 7,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx5.lineTo(
        boardOffsetX + (square[0] * cellSquare + 3) + 4 * anim2,
        boardOffsetY + (square[1] * cellSquare + 7) - 4 * anim2
      );
      ctx5.closePath();
      ctx5.stroke();
      ctx5.strokeStyle = "black";
    }
  }
  function drawAquariumHints(ctx5) {
    ctx5.lineWidth = 2;
    ctx5.fillStyle = "white";
    ctx5.fillRect(
      boardOffsetX - 2,
      boardOffsetY - 3 * cellSquare / 2,
      cellSquare * 10 + 3,
      cellSquare * 3 / 2
    );
    ctx5.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 3 * cellSquare / 2 - 0.5,
      cellSquare * 10 + 1,
      cellSquare * 3 / 2 - 0.5
    );
    ctx5.fillRect(
      boardOffsetX - 4 * cellSquare / 2,
      boardOffsetY - 2,
      cellSquare * 4 / 2,
      cellSquare * 10 + 3
    );
    ctx5.strokeRect(
      boardOffsetX - 4 * cellSquare / 2 - 1,
      boardOffsetY - 1,
      cellSquare * 4 / 2,
      cellSquare * 10 + 1
    );
    ctx5.fillStyle = "black";
    for (let i = 0; i < 10; i++) {
      const clueCount = window.gameStateBoard.solution.filter(
        (sqr) => sqr[0] === i
      ).length;
      const isTen = clueCount === 10;
      const fillCount = window.gameStateBoard.fills.filter(
        (sqr) => sqr[0] === i
      ).length;
      const crossCount = window.gameStateBoard.crosses.filter(
        (sqr) => sqr[0] === i
      ).length;
      if (fillCount === clueCount) {
        ctx5.fillStyle = "gray";
      } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
        ctx5.fillStyle = "green";
      } else {
        ctx5.fillStyle = "black";
      }
      drawLetter({
        ctx: ctx5,
        string: `${clueCount}`,
        pos: {
          x: boardOffsetX + i * cellSquare + (isTen ? 0 : 3),
          y: boardOffsetY - 3
        },
        fontSize: isTen ? 8 : 10
      });
    }
    for (let i = 0; i < 10; i++) {
      const clueCount = window.gameStateBoard.solution.filter(
        (sqr) => sqr[1] === i
      ).length;
      const fillCount = window.gameStateBoard.fills.filter(
        (sqr) => sqr[1] === i
      ).length;
      const crossCount = window.gameStateBoard.crosses.filter(
        (sqr) => sqr[1] === i
      ).length;
      if (fillCount === clueCount) {
        ctx5.fillStyle = "gray";
      } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
        ctx5.fillStyle = "green";
      } else {
        ctx5.fillStyle = "black";
      }
      drawLetter({
        ctx: ctx5,
        string: `${clueCount}`,
        pos: {
          x: boardOffsetX - cellSquare + (clueCount === 10 ? -3 : 2),
          y: boardOffsetY + i * cellSquare + 8
        },
        fontSize: 10
      });
    }
  }
  function drawNonogramHints(ctx5) {
    ctx5.lineWidth = 2;
    ctx5.fillStyle = "white";
    ctx5.fillRect(
      boardOffsetX - 2,
      boardOffsetY - 6 * cellSquare / 2 - 8,
      cellSquare * 10 + 3,
      cellSquare * 6 / 2 + 8
    );
    ctx5.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 6 * cellSquare / 2 - 9,
      cellSquare * 10 + 1,
      cellSquare * 6 / 2 + 8
    );
    const selection = window.gameStateBoard.selection;
    ctx5.fillStyle = "#ca9b50";
    ctx5.fillRect(
      boardOffsetX + selection[0] * (cellSize + cellOffset),
      boardOffsetY - 6 * cellSquare / 2 - 8,
      cellSize + cellOffset,
      cellSquare * 6 / 2 + 6
    );
    ctx5.fillStyle = "white";
    ctx5.fillRect(
      boardOffsetX - 8 * cellSquare / 2,
      boardOffsetY - 2,
      cellSquare * 8 / 2,
      cellSquare * 10 + 3
    );
    ctx5.strokeRect(
      boardOffsetX - 8 * cellSquare / 2 - 1,
      boardOffsetY - 1,
      cellSquare * 8 / 2,
      cellSquare * 10 + 1
    );
    ctx5.fillStyle = "#ca9b50";
    ctx5.fillRect(
      boardOffsetX - 8 * cellSquare / 2,
      boardOffsetY + selection[1] * (cellSize + cellOffset),
      cellSquare * 8 / 2 - 2,
      cellSquare
    );
    ctx5.fillStyle = "white";
    ctx5.fillStyle = "black";
    let currentColFills = [];
    for (let i = 0; i < 10; i++) {
      currentColFills[i] = "";
      for (let j = 0; j < 10; j++) {
        if (hasTuple(window.gameStateBoard.fills, [i, j])) {
          currentColFills[i] = "f".concat(currentColFills[i]);
        } else if (hasTuple(window.gameStateBoard.crosses, [i, j])) {
          currentColFills[i] = "x".concat(currentColFills[i]);
        } else {
          currentColFills[i] = "e".concat(currentColFills[i]);
        }
      }
    }
    let currentColSolution = [];
    for (let i = 0; i < 10; i++) {
      currentColSolution[i] = "";
      for (let j = 0; j < 10; j++) {
        if (hasTuple(window.gameStateBoard.solution, [i, j])) {
          currentColSolution[i] = "s".concat(currentColSolution[i]);
        } else {
          currentColSolution[i] = "e".concat(currentColSolution[i]);
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      let hintStringMatchArray = (currentColSolution[i].match(/s+/g) || []).map(
        (m) => m.length
      );
      let fillStringMatchArray = (currentColFills[i].match(/f+/g) || []).map(
        (m) => m.length
      );
      let crossStringMatchArray = (currentColFills[i].match(/x+/g) || []).map(
        (m) => m.length
      );
      hintStringMatchArray = hintStringMatchArray.length === 0 ? [0] : hintStringMatchArray;
      fillStringMatchArray = fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
      crossStringMatchArray = crossStringMatchArray.length === 0 ? [0] : crossStringMatchArray;
      const isFillMatch = testFills(hintStringMatchArray, fillStringMatchArray);
      const fillsTotal = fillStringMatchArray.reduce((acc, v) => acc + v);
      const hintsTotal = hintStringMatchArray.reduce((acc, v) => acc + v);
      const crossTotal = crossStringMatchArray.reduce((acc, v) => acc + v);
      for (let j = 0; j < hintStringMatchArray.length; j++) {
        const clue = hintStringMatchArray[j];
        const isTen = clue === 10;
        if (isFillMatch[j]) {
          ctx5.fillStyle = "gray";
        } else if (fillsTotal > hintsTotal || crossTotal + hintsTotal > 10) {
          ctx5.fillStyle = "red";
        } else {
          ctx5.fillStyle = "black";
        }
        drawLetter({
          ctx: ctx5,
          string: `${clue}`,
          pos: {
            x: boardOffsetX + i * cellSquare + (isTen ? 0 : 3),
            y: boardOffsetY - j * (cellSquare / 1.2) - 3
          },
          fontSize: isTen ? 8 : 10
        });
      }
    }
    let currentRowFills = [];
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
    let currentRowSolution = [];
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
        (m) => m.length
      );
      let fillStringMatchArray = (currentRowFills[i].match(/f+/g) || []).map(
        (m) => m.length
      );
      let crossStringMatchArray = (currentRowFills[i].match(/x+/g) || []).map(
        (m) => m.length
      );
      hintStringMatchArray = hintStringMatchArray.length === 0 ? [0] : hintStringMatchArray;
      fillStringMatchArray = fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
      crossStringMatchArray = crossStringMatchArray.length === 0 ? [0] : crossStringMatchArray;
      const isFillMatch = testFills(hintStringMatchArray, fillStringMatchArray);
      const fillsTotal = fillStringMatchArray.reduce((acc, v) => acc + v);
      const hintsTotal = hintStringMatchArray.reduce((acc, v) => acc + v);
      const crossTotal = crossStringMatchArray.reduce((acc, v) => acc + v);
      for (let j = 0; j < hintStringMatchArray.length; j++) {
        const clue = hintStringMatchArray[j];
        const isTen = clue === 10;
        if (isFillMatch[j]) {
          ctx5.fillStyle = "gray";
        } else if (fillsTotal > hintsTotal || crossTotal + hintsTotal > 10) {
          ctx5.fillStyle = "red";
        } else {
          ctx5.fillStyle = "black";
        }
        drawLetter({
          ctx: ctx5,
          string: `${clue}`,
          pos: {
            x: boardOffsetX - j * (cellSquare / 1.2) - (isTen ? 14 : 9),
            y: boardOffsetY + i * cellSquare + 8
          },
          fontSize: 10
        });
      }
    }
  }

  // src/boardLogic.ts
  var builtBoard = false;
  var paintMode = null;
  function getNeighbors(available, point) {
    const deltas = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    return deltas.map(([dx, dy]) => [point[0] + dx, point[1] + dy]).filter((p) => hasTuple(available, p));
  }
  function getRegionNeighbors(available, region) {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
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
    let availableTanks = [];
    let tanks = [];
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
          continue;
        }
        const neighborToAdd = randomItem(neighbors);
        availableTanks = availableTanks.filter(
          (k) => !(k[0] === neighborToAdd[0] && k[1] === neighborToAdd[1])
        );
        tank.push(neighborToAdd);
        tanks[i] = tank;
      }
    }
    window.gameStateBoard.tanks = tanks;
  }
  function buildBoard() {
    buildTanks();
    const tanks = window.gameStateBoard.tanks;
    for (let tankIndex = 0; tankIndex < tanks.length; tankIndex++) {
      const tank = tanks[tankIndex];
      const [lowestWaterLevel, highestWaterLevel] = tank.reduce(
        ([lwl, hwl], square) => {
          return [Math.min(lwl, square[1]), Math.max(hwl, square[1])];
        },
        [Infinity, -1]
      );
      const waterLevel = Math.floor(
        Math.random() * (highestWaterLevel - lowestWaterLevel + 2)
      );
      for (let sIndex = 0; sIndex < tank.length; sIndex++) {
        const square = tank[sIndex];
        if (square[1] >= waterLevel + lowestWaterLevel) {
          window.gameStateBoard.solution.push(square);
        }
      }
    }
  }
  function updateBoard() {
    if (!builtBoard && window.gameState.screen === "Board") {
      buildBoard();
      builtBoard = true;
      window.gameStateBoard.startTime = /* @__PURE__ */ new Date();
    }
    if (window.input.p1.buttonShiftBoard) {
      window.gameStateBoard.switchFrame = getFrame();
      delayAction((state) => {
        state.gameStateBoard.mode = state.gameStateBoard.mode === "Nonogram" ? "Aquarium" : "Nonogram";
        if (state.gameStateBoard.mode === "Aquarium") {
          document.getElementsByTagName("html")[0].classList.add("aquarium");
        } else {
          document.getElementsByTagName("html")[0].classList.remove("aquarium");
        }
      }, 24);
    }
    if (window.input.p1.buttonRight && window.input.p1.buttonUp) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.min(
          state.gameStateBoard.selection[0] + 1,
          9
        );
        state.gameStateBoard.selection[1] = Math.max(
          state.gameStateBoard.selection[1] - 1,
          0
        );
      });
    }
    if (window.input.p1.buttonRight && window.input.p1.buttonDown) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.min(
          state.gameStateBoard.selection[0] + 1,
          9
        );
        state.gameStateBoard.selection[1] = Math.min(
          state.gameStateBoard.selection[1] + 1,
          9
        );
      });
    }
    if (window.input.p1.buttonLeft && window.input.p1.buttonUp) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.max(
          state.gameStateBoard.selection[0] - 1,
          0
        );
        state.gameStateBoard.selection[1] = Math.max(
          state.gameStateBoard.selection[1] - 1,
          0
        );
      });
    }
    if (window.input.p1.buttonLeft && window.input.p1.buttonDown) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.max(
          state.gameStateBoard.selection[0] - 1,
          0
        );
        state.gameStateBoard.selection[1] = Math.min(
          state.gameStateBoard.selection[1] + 1,
          9
        );
      });
    }
    if (window.input.p1.buttonRight) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.min(
          state.gameStateBoard.selection[0] + 1,
          9
        );
      });
    }
    if (window.input.p1.buttonLeft) {
      delayAction((state) => {
        state.gameStateBoard.selection[0] = Math.max(
          state.gameStateBoard.selection[0] - 1,
          0
        );
      });
    }
    if (window.input.p1.buttonDown) {
      delayAction((state) => {
        state.gameStateBoard.selection[1] = Math.min(
          state.gameStateBoard.selection[1] + 1,
          9
        );
      });
    }
    if (window.input.p1.buttonUp) {
      delayAction((state) => {
        state.gameStateBoard.selection[1] = Math.max(
          state.gameStateBoard.selection[1] - 1,
          0
        );
      });
    }
    if (mousePos.x > boardOffsetX && mousePos.x < boardOffsetX + (cellSize + cellOffset) * 10 && mousePos.y > boardOffsetY && mousePos.y < boardOffsetY + (cellSize + cellOffset) * 10) {
      window.gameStateBoard.selection = [
        Math.min(
          Math.max(
            0,
            Math.floor((mousePos.x - boardOffsetX - 3) / (cellSize + cellOffset))
          ),
          9
        ),
        Math.min(
          Math.max(
            0,
            Math.floor((mousePos.y - boardOffsetY - 1) / (cellSize + cellOffset))
          ),
          9
        )
      ];
    }
    let justPressedFilledButton = window.input.p1.buttonFillSquare && !window.input.p1Previous.buttonFillSquare;
    const timeElapsed = (/* @__PURE__ */ new Date()).getTime() - window.gameStateBoard.startTime.getTime();
    if (justPressedFilledButton && paintMode === null && timeElapsed < 120) {
      paintMode = "erase";
    } else if (justPressedFilledButton) {
      if (hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection)) {
        paintMode = "erase";
      } else {
        paintMode = "fill";
      }
    }
    if (window.input.p1.buttonFillSquare) {
      if (paintMode === "erase") {
        window.gameStateBoard.fills = removeTuple(
          window.gameStateBoard.fills,
          window.gameStateBoard.selection
        );
      }
      if (paintMode === "fill") {
        const selection = window.gameStateBoard.selection;
        window.gameStateBoard.fills.push([...selection]);
        drawingCells[`${selection[0]}_${selection[1]}`] = 10;
        if (hasTuple(window.gameStateBoard.crosses, selection)) {
          window.gameStateBoard.crosses = removeTuple(
            window.gameStateBoard.crosses,
            selection
          );
        }
      }
      window.gameStateBoard.fills = uniqueTuples(window.gameStateBoard.fills);
    }
    let justPressedCrossButton = window.input.p1.buttonCrossSquare && !window.input.p1Previous.buttonCrossSquare;
    if (justPressedCrossButton) {
      if (hasTuple(window.gameStateBoard.crosses, window.gameStateBoard.selection)) {
        paintMode = "erase";
      } else {
        paintMode = "cross";
      }
    }
    if (window.input.p1.buttonCrossSquare) {
      if (paintMode === "erase") {
        window.gameStateBoard.crosses = removeTuple(
          window.gameStateBoard.crosses,
          window.gameStateBoard.selection
        );
      }
      if (paintMode === "cross") {
        const selection = window.gameStateBoard.selection;
        window.gameStateBoard.crosses.push([...selection]);
        drawingCells[`${selection[0]}_${selection[1]}`] = 10;
        if (hasTuple(window.gameStateBoard.fills, selection)) {
          window.gameStateBoard.fills = removeTuple(
            window.gameStateBoard.fills,
            selection
          );
        }
      }
      window.gameStateBoard.crosses = uniqueTuples(window.gameStateBoard.crosses);
    }
    const fills = window.gameStateBoard.fills;
    const solution = window.gameStateBoard.solution;
    if (!window.gameStateBoard.endTime && fills.length === solution.length) {
      if (solution.every((s) => hasTuple(fills, s))) {
        window.gameStateBoard.endTime = /* @__PURE__ */ new Date();
      }
    }
  }

  // src/drawButton.ts
  var ctx3 = getCtx();
  function drawButton({
    selected,
    text,
    pos,
    fontSize = 20
  }) {
    ctx3.beginPath();
    ctx3.fillStyle = selected ? "black" : "white";
    const buttonWidth = ctx3.measureText(text).width;
    ctx3.roundRect(pos.x - 4, pos.y - fontSize, buttonWidth + 8, fontSize + 6, 10);
    ctx3.fill();
    ctx3.closePath();
    ctx3.fillStyle = selected ? "white" : "black";
    drawLetter({
      ctx: ctx3,
      string: text,
      pos,
      fontSize,
      bobble: selected
    });
    return {
      x: pos.x - 4,
      y: pos.y - fontSize,
      width: buttonWidth + 8,
      height: fontSize + 6
    };
  }

  // src/mainMenu.ts
  var mainMenuButtons = {
    play: { x: 0, y: 0, width: 0, height: 0 },
    settings: { x: 0, y: 0, width: 0, height: 0 }
  };
  function drawMainMenu(ctx5) {
    const selection = window.gameStateMenu.selection;
    ctx5.fillStyle = "white";
    ctx5.strokeStyle = "black";
    ctx5.lineWidth = 5;
    drawLetter({
      ctx: ctx5,
      string: "Aquaricross!!",
      pos: { x: 14, y: 42 },
      fontSize: 32,
      withStroke: true,
      bobble: true,
      deltaY: -10,
      animateIn: selection ? 0 : 10
    });
    ctx5.fillStyle = "black";
    ctx5.strokeStyle = "";
    let animationEnd = ("Aquaricross!!".length + 1) * 9;
    if (getFrame() > animationEnd || selection) {
      mainMenuButtons.play = drawButton({
        selected: selection === "Play",
        text: "Play",
        pos: { x: 60, y: 100 }
      });
      mainMenuButtons.settings = drawButton({
        selected: selection === "Settings",
        text: "Settings",
        pos: { x: 60, y: 128 }
      });
    }
  }

  // src/mainMenuLogic.ts
  function updateMenu() {
    if (window.gameStateMenu.selection === null && (window.input.p1.buttonDown || window.input.p1.buttonUp)) {
      window.gameStateMenu.selection = "Play";
    }
    if (window.gameStateMenu.selection === "Play" && window.input.p1.buttonDown) {
      window.gameStateMenu.selection = "Settings";
    }
    if (window.gameStateMenu.selection === "Settings" && window.input.p1.buttonUp) {
      window.gameStateMenu.selection = "Play";
    }
    if (window.gameStateMenu.selection === "Play" && window.input.p1.buttonSelect) {
      window.gameState.screen = "Board";
    }
    if (window.gameStateMenu.selection === "Settings" && window.input.p1.buttonSelect) {
      window.gameState.screen = "Settings";
    }
    if (mousePos.x > mainMenuButtons.play.x && mousePos.x < mainMenuButtons.play.x + mainMenuButtons.play.width && mousePos.y > mainMenuButtons.play.y && mousePos.y < mainMenuButtons.play.y + mainMenuButtons.play.height) {
      window.gameStateMenu.selection = "Play";
    }
    if (mousePos.x > mainMenuButtons.settings.x && mousePos.x < mainMenuButtons.settings.x + mainMenuButtons.settings.width && mousePos.y > mainMenuButtons.settings.y && mousePos.y < mainMenuButtons.settings.y + mainMenuButtons.settings.height) {
      window.gameStateMenu.selection = "Settings";
    }
  }

  // src/settingsLogic.ts
  var settingsSelection = null;
  var returnFromSettings = 0;
  function updateSettings() {
    delayAction(() => {
      if (window.input.p1.buttonUp) {
        settingsSelection = ((settingsSelection || buttonsArray.length) - 1) % buttonsArray.length;
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

  // src/settings.ts
  var buttons = {
    Up: "buttonUp",
    Down: "buttonDown",
    Right: "buttonRight",
    Left: "buttonLeft",
    Select: "buttonSelect",
    Back: "buttonBack",
    "Fill Square": "buttonFillSquare",
    "Cross Square": "buttonCrossSquare",
    "Mode Switch": "buttonShiftBoard"
  };
  var buttonsArray = Object.keys(buttons);
  function drawSettings(ctx5) {
    ctx5.fillStyle = "black";
    const fontSize = 12;
    for (let i = 0; i < buttonsArray.length; i++) {
      if (settingsSelection === i) {
        ctx5.fillStyle = "white";
      } else {
        ctx5.fillStyle = "black";
      }
      drawLetter({
        ctx: getCtx(),
        string: buttonsArray[i],
        pos: { x: 20, y: 40 + (fontSize + 1) * i },
        fontSize
      });
      let key = window.keySettings[buttons[buttonsArray[i]]];
      key = key === " " ? "space" : key;
      drawButton({
        selected: false,
        // @ts-ignore
        text: key,
        pos: { x: 120, y: 40 + (fontSize + 1) * i },
        fontSize
      });
      drawLetter({
        ctx: ctx5,
        // @ts-ignore
        string: window.input.p1[buttons[buttonsArray[i]]],
        pos: { x: 200, y: 40 + (fontSize + 1) * i },
        fontSize
      });
      if (returnFromSettings > 0) {
        const gradient = ctx5.createLinearGradient(2, 0, 35, 0);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(returnFromSettings / 100, "white");
        gradient.addColorStop((returnFromSettings + 1) / 100, "black");
        gradient.addColorStop(1, "black");
        ctx5.fillStyle = "orange";
        ctx5.strokeStyle = gradient;
        ctx5.beginPath();
        ctx5.moveTo(6, 16);
        ctx5.lineTo(15, 6);
        ctx5.lineTo(15, 13);
        ctx5.lineTo(22, 6);
        ctx5.lineTo(35, 12);
        ctx5.lineTo(32, 18);
        ctx5.lineTo(23, 12);
        ctx5.lineTo(15, 18);
        ctx5.lineTo(15, 23);
        ctx5.lineTo(6, 16);
        ctx5.closePath();
        ctx5.stroke();
        ctx5.fill();
      }
    }
  }

  // src/sprites.ts
  var ctx4 = getCtx();
  var canvas4 = getCanvas();
  function drawSprites(frame) {
    if (window.gameState.screen === "Menu") {
      updateMenu();
      drawMainMenu(ctx4);
    }
    if (window.gameState.screen === "Board") {
      updateBoard();
      drawBoard(ctx4);
    }
    if (window.gameState.screen === "Settings") {
      updateSettings();
      drawSettings(ctx4);
    }
    drawMouse(ctx4);
  }

  // src/index.ts
  var frameNumber = 0;
  window.gameState = {
    screen: "Menu"
  };
  window.gameStateBoard = {
    mode: "Nonogram",
    selection: [0, 0],
    fills: [],
    crosses: [],
    solution: [],
    tanks: [],
    startTime: /* @__PURE__ */ new Date(),
    endTime: void 0
  };
  window.gameStateMenu = {
    selection: null
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
      buttonShiftBoard: false
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
      buttonShiftBoard: false
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
      buttonShiftBoard: false
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
      buttonShiftBoard: false
    }
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
    buttonShiftBoard: " "
  };
  function tick() {
    frameNumber++;
    window.frameNumber = frameNumber;
    for (const inputKey of Object.keys(window.input.p1)) {
      window.input.p1Previous[inputKey] = window.input.p1[inputKey];
    }
    requestAnimationFrame(() => drawBackground(frameNumber));
    requestAnimationFrame(() => drawSprites(frameNumber));
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
    for (let inputKey of Object.keys(window.keySettings)) {
      if (window.keySettings[inputKey] === event.key) {
        window.input.p1[inputKey] = true;
      }
    }
  });
  document.addEventListener("keyup", (event) => {
    for (let inputKey of Object.keys(window.keySettings)) {
      if (window.keySettings[inputKey] === event.key) {
        window.input.p1[inputKey] = false;
      }
    }
  });
  start();
})();
