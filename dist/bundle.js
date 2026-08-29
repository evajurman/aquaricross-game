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
    const ctx6 = canvas5.getContext("2d");
    return ctx6;
  }
  function getCanvas() {
    const canvas5 = document.getElementById("canvas");
    return canvas5;
  }
  function getFrame() {
    return window.frameNumber;
  }
  var delay = 0;
  function delayAction(callback, delayLength = 10) {
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
    const scale = Math.min(
      window.innerWidth / GBA_WIDTH,
      window.innerHeight / GBA_HEIGHT
    );
    const cssWidth = GBA_WIDTH * scale;
    const cssHeight = GBA_HEIGHT * scale;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = GBA_WIDTH;
    canvas.height = GBA_HEIGHT;
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
    ctx: ctx6,
    letter,
    pos,
    fontFamily = "LuckiestGuy",
    fontSize,
    withStroke = false,
    noFill = false,
    bobble = false,
    vertical = false
  }) {
    ctx6.font = `${fontSize}px ${fontFamily}`;
    if (bobble) {
      let currentX = pos.x + ctx6.measureText(letter).width;
      let frame = getFrame();
      for (let char = letter.length - 1; char >= 0; char--) {
        const letterWidth = vertical ? 0 : ctx6.measureText(letter[char]).width;
        const centerX = currentX;
        ctx6.save();
        ctx6.translate(
          centerX - letterWidth / 2,
          vertical ? fontSize * char * 0.55 + pos.y : pos.y + 0
        );
        const angle = Math.cos(Math.sin((frame + char * 8) / 60 * (Math.PI / 4))) - 0.75;
        ctx6.rotate(angle);
        if (withStroke) {
          ctx6.strokeText(letter[char], -letterWidth / 2, 0);
        }
        if (!noFill) {
          ctx6.fillText(letter[char], -letterWidth / 2, 0);
        }
        ctx6.restore();
        currentX -= letterWidth;
      }
    } else {
      if (withStroke) {
        ctx6.strokeText(letter, pos.x, pos.y);
      }
      if (!noFill) {
        ctx6.fillText(letter, pos.x, pos.y);
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

  // src/board.ts
  var boardOffsetX = 86;
  var boardOffsetY = 46;
  var cellSize = 10;
  var cellOffset = 1;
  var cellSquare = cellSize + cellOffset;
  function drawBoard(ctx6) {
    ctx6.fillStyle = "white";
    ctx6.strokeStyle = "black";
    ctx6.lineWidth = 0.2;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ctx6.fillRect(
          i * cellSquare + boardOffsetX,
          j * cellSquare + boardOffsetY,
          cellSize,
          cellSize
        );
        ctx6.strokeRect(
          i * cellSquare + boardOffsetX,
          j * cellSquare + boardOffsetY,
          cellSize,
          cellSize
        );
      }
    }
    if (window.gameStateBoard.mode === "Nonogram") {
      drawNonogramHints(ctx6);
      ctx6.lineWidth = 1;
      ctx6.strokeRect(boardOffsetX, boardOffsetY, cellSquare * 5, cellSquare * 5);
      ctx6.strokeRect(
        cellSquare * 5 + boardOffsetX,
        boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx6.strokeRect(
        boardOffsetX,
        cellSquare * 5 + boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx6.strokeRect(
        cellSquare * 5 + boardOffsetX,
        cellSquare * 5 + boardOffsetY,
        cellSquare * 5,
        cellSquare * 5
      );
      ctx6.strokeRect(
        boardOffsetX,
        boardOffsetY,
        cellSquare * 10,
        cellSquare * 10
      );
    }
    if (window.gameStateBoard.mode === "Aquarium") {
      drawAquariumHints(ctx6);
      ctx6.lineWidth = 1;
      for (let tIndex = 0; tIndex < window.gameStateBoard.tanks.length; tIndex++) {
        const tank = window.gameStateBoard.tanks[tIndex];
        for (let squareIndex = 0; squareIndex < tank.length; squareIndex++) {
          const [squareX, squareY] = tank[squareIndex];
          if (!hasTuple(tank, [squareX - 1, squareY])) {
            ctx6.beginPath();
            ctx6.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx6.lineTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx6.closePath();
            ctx6.stroke();
          }
          if (!hasTuple(tank, [squareX + 1, squareY])) {
            ctx6.beginPath();
            ctx6.moveTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx6.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx6.closePath();
            ctx6.stroke();
          }
          if (!hasTuple(tank, [squareX, squareY - 1])) {
            ctx6.beginPath();
            ctx6.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx6.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + squareY * cellSquare
            );
            ctx6.closePath();
            ctx6.stroke();
          }
          if (!hasTuple(tank, [squareX, squareY + 1])) {
            ctx6.beginPath();
            ctx6.moveTo(
              boardOffsetX + squareX * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx6.lineTo(
              boardOffsetX + (squareX + 1) * cellSquare,
              boardOffsetY + (squareY + 1) * cellSquare
            );
            ctx6.closePath();
            ctx6.stroke();
          }
        }
      }
    }
    ctx6.lineWidth = 1;
    ctx6.strokeStyle = window.gameStateBoard.mode === "Nonogram" ? "blue" : "red";
    const [cursorX, cursorY] = window.gameStateBoard.selection;
    ctx6.strokeRect(
      boardOffsetX + cursorX * cellSquare + 1,
      boardOffsetY + cursorY * cellSquare + 1,
      cellSize - 2,
      cellSize - 2
    );
    ctx6.fillStyle = "black";
    const time = getHHMMSSDifference(
      window.gameStateBoard.endTime || /* @__PURE__ */ new Date(),
      window.gameStateBoard.startTime
    );
    for (let i = 0; i < time.length; i++) {
      drawLetter({
        ctx: ctx6,
        letter: `${time[i]}`,
        pos: {
          x: boardOffsetX - 42 + i * 8,
          y: boardOffsetY - 4
        },
        fontSize: 10
      });
    }
    drawFills(ctx6);
    drawCrosses(ctx6);
    ctx6.strokeStyle = "black";
    ctx6.fillStyle = "white";
    ctx6.lineWidth = 4;
    if (window.gameStateBoard.mode === "Aquarium") {
      drawLetter({
        ctx: ctx6,
        letter: "AQUARIUM",
        pos: { x: 52, y: 32 },
        fontSize: 32,
        withStroke: true,
        bobble: true,
        vertical: true
      });
    }
    if (window.gameStateBoard.mode === "Nonogram") {
      drawLetter({
        ctx: ctx6,
        letter: "NONOGRAM",
        pos: { x: 36, y: 32 },
        fontSize: 32,
        withStroke: true,
        bobble: true,
        vertical: true
      });
    }
  }
  function drawFills(ctx6) {
    ctx6.fillStyle = window.gameStateBoard.mode === "Nonogram" ? "black" : "#4d56ff";
    for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
      const square = window.gameStateBoard.fills[i];
      ctx6.beginPath();
      ctx6.roundRect(
        boardOffsetX + square[0] * cellSquare + 1,
        boardOffsetY + square[1] * cellSquare + 1,
        cellSize - 2,
        cellSize - 2,
        2
      );
      ctx6.fill();
      ctx6.closePath();
    }
  }
  function drawCrosses(ctx6) {
    for (let i = 0; i < window.gameStateBoard.crosses.length; i++) {
      const square = window.gameStateBoard.crosses[i];
      ctx6.beginPath();
      ctx6.lineWidth = 1.5;
      ctx6.strokeStyle = "#663500";
      ctx6.moveTo(
        boardOffsetX + square[0] * cellSquare + 3,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx6.lineTo(
        boardOffsetX + square[0] * cellSquare + 7,
        boardOffsetY + square[1] * cellSquare + 7
      );
      ctx6.closePath();
      ctx6.stroke();
      ctx6.beginPath();
      ctx6.moveTo(
        boardOffsetX + square[0] * cellSquare + 7,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx6.lineTo(
        boardOffsetX + square[0] * cellSquare + 3,
        boardOffsetY + square[1] * cellSquare + 7
      );
      ctx6.closePath();
      ctx6.stroke();
      ctx6.strokeStyle = "black";
    }
  }
  function drawAquariumHints(ctx6) {
    ctx6.lineWidth = 2;
    ctx6.fillStyle = "white";
    ctx6.fillRect(
      boardOffsetX - 2,
      boardOffsetY - 3 * cellSquare / 2,
      cellSquare * 10 + 3,
      cellSquare * 3 / 2
    );
    ctx6.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 3 * cellSquare / 2 - 0.5,
      cellSquare * 10 + 1,
      cellSquare * 3 / 2 - 0.5
    );
    ctx6.fillRect(
      boardOffsetX - 4 * cellSquare / 2,
      boardOffsetY - 2,
      cellSquare * 4 / 2,
      cellSquare * 10 + 3
    );
    ctx6.strokeRect(
      boardOffsetX - 4 * cellSquare / 2 - 1,
      boardOffsetY - 1,
      cellSquare * 4 / 2,
      cellSquare * 10 + 1
    );
    ctx6.fillStyle = "black";
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
        ctx6.fillStyle = "gray";
      } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
        ctx6.fillStyle = "red";
      } else {
        ctx6.fillStyle = "black";
      }
      drawLetter({
        ctx: ctx6,
        letter: `${clueCount}`,
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
        ctx6.fillStyle = "gray";
      } else if (fillCount > clueCount || crossCount > 10 - clueCount) {
        ctx6.fillStyle = "red";
      } else {
        ctx6.fillStyle = "black";
      }
      drawLetter({
        ctx: ctx6,
        letter: `${clueCount}`,
        pos: {
          x: boardOffsetX - cellSquare + (clueCount === 10 ? -3 : 2),
          y: boardOffsetY + i * cellSquare + 8
        },
        fontSize: 10
      });
    }
  }
  function drawNonogramHints(ctx6) {
    ctx6.lineWidth = 2;
    ctx6.fillStyle = "white";
    ctx6.fillRect(
      boardOffsetX - 2,
      boardOffsetY - 6 * cellSquare / 2 - 8,
      cellSquare * 10 + 3,
      cellSquare * 6 / 2 + 8
    );
    ctx6.strokeRect(
      boardOffsetX - 1,
      boardOffsetY - 6 * cellSquare / 2 - 9,
      cellSquare * 10 + 1,
      cellSquare * 6 / 2 + 8
    );
    ctx6.fillRect(
      boardOffsetX - 8 * cellSquare / 2,
      boardOffsetY - 2,
      cellSquare * 8 / 2,
      cellSquare * 10 + 3
    );
    ctx6.strokeRect(
      boardOffsetX - 8 * cellSquare / 2 - 1,
      boardOffsetY - 1,
      cellSquare * 8 / 2,
      cellSquare * 10 + 1
    );
    ctx6.fillStyle = "black";
    let currentColFills = [];
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
      let clueArray = { clues: [] };
      let continued = false;
      for (let j = 0; j < 10; j++) {
        if (hasTuple(window.gameStateBoard.solution, [i, j])) {
          if (!continued) {
            clueArray.clues.push(1);
          }
          if (continued) {
            clueArray.clues[clueArray.clues.length - 1] = clueArray.clues[clueArray.clues.length - 1] + 1;
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
        (m) => m.length
      );
      fillStringMatchArray = fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
      const isFillMatch = testFills(clueArray.clues, fillStringMatchArray);
      for (let j = 0; j < clueArray.clues.length; j++) {
        const clue = clueArray.clues[clueArray.clues.length - 1 - j];
        const isTen = clue === 10;
        if (isFillMatch[j]) {
          ctx6.fillStyle = "gray";
        } else {
          ctx6.fillStyle = "black";
        }
        drawLetter({
          ctx: ctx6,
          letter: `${clue}`,
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
      hintStringMatchArray = hintStringMatchArray.length === 0 ? [0] : hintStringMatchArray;
      fillStringMatchArray = fillStringMatchArray.length === 0 ? [0] : fillStringMatchArray;
      const isFillMatch = testFills(hintStringMatchArray, fillStringMatchArray);
      for (let j = 0; j < hintStringMatchArray.length; j++) {
        const clue = hintStringMatchArray[j];
        const isTen = clue === 10;
        if (isFillMatch[j]) {
          ctx6.fillStyle = "gray";
        } else {
          ctx6.fillStyle = "black";
        }
        drawLetter({
          ctx: ctx6,
          letter: `${clue}`,
          pos: {
            x: boardOffsetX - j * (cellSquare / 1.2) - (isTen ? 14 : 9),
            y: boardOffsetY + i * cellSquare + 8
          },
          fontSize: 10
        });
      }
    }
  }

  // src/mouse.ts
  var mousePos = { x: 0, y: 0 };
  var canvas3 = getCanvas();
  var ctx3 = getCtx();
  function drawMouse(ctx6) {
    ctx6.strokeStyle = "orange";
    ctx6.fillStyle = "yellow";
    ctx6.lineWidth = 3;
    ctx6.beginPath();
    ctx6.moveTo(mousePos.x, mousePos.y);
    ctx6.lineTo(mousePos.x + 7, mousePos.y + 6);
    ctx6.lineTo(mousePos.x + 3, mousePos.y + 7);
    ctx6.lineTo(mousePos.x, mousePos.y + 10);
    ctx6.lineTo(mousePos.x, mousePos.y);
    ctx6.closePath();
    ctx6.stroke();
    ctx6.fill();
  }
  document.addEventListener("mousemove", (event) => {
    const rect = canvas3.getBoundingClientRect();
    const cssX = event.clientX - rect.left;
    const cssY = event.clientY - rect.top;
    mousePos.x = cssX * (canvas3.width / rect.width);
    mousePos.y = cssY * (canvas3.height / rect.height);
  });
  document.addEventListener("mousedown", (event) => {
    event.preventDefault();
    window.input.p1.buttonSelect = true;
    if (window.gameState.screen === "Board" && event.button === 0) {
      window.input.p1.buttonFillSquare = true;
    }
    if (window.gameState.screen === "Board" && event.button === 2) {
      window.input.p1.buttonCrossSquare = true;
    }
  });
  document.addEventListener("mouseup", (event) => {
    event.preventDefault();
    window.input.p1.buttonSelect = false;
    if (window.gameState.screen === "Board" && event.button === 0) {
      window.input.p1.buttonFillSquare = false;
    }
    if (window.gameState.screen === "Board" && event.button === 2) {
      window.input.p1.buttonCrossSquare = false;
    }
  });
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

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
      delayAction((state) => {
        state.gameStateBoard.mode = state.gameStateBoard.mode === "Nonogram" ? "Aquarium" : "Nonogram";
      });
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
    if (justPressedFilledButton && paintMode === null) {
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
        window.gameStateBoard.fills.push([...window.gameStateBoard.selection]);
        if (hasTuple(window.gameStateBoard.crosses, window.gameStateBoard.selection)) {
          window.gameStateBoard.crosses = removeTuple(
            window.gameStateBoard.crosses,
            window.gameStateBoard.selection
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
        window.gameStateBoard.crosses.push([...window.gameStateBoard.selection]);
        if (hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection)) {
          window.gameStateBoard.fills = removeTuple(
            window.gameStateBoard.fills,
            window.gameStateBoard.selection
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
  var ctx4 = getCtx();
  function drawButton({
    selected,
    text,
    pos,
    fontSize = 20
  }) {
    ctx4.beginPath();
    ctx4.fillStyle = selected ? "black" : "white";
    const buttonWidth = ctx4.measureText(text).width;
    ctx4.roundRect(pos.x - 4, pos.y - fontSize, buttonWidth + 8, fontSize + 6, 10);
    ctx4.fill();
    ctx4.closePath();
    ctx4.fillStyle = selected ? "white" : "black";
    drawLetter({
      ctx: ctx4,
      letter: text,
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
  function drawMainMenu(ctx6) {
    ctx6.fillStyle = "white";
    ctx6.strokeStyle = "black";
    ctx6.lineWidth = 5;
    const letter = "Aquaricross!!".slice(0, getFrame() * getFrame() / 900);
    drawLetter({
      ctx: ctx6,
      letter,
      pos: { x: 14, y: 42 },
      fontSize: 32,
      withStroke: true,
      bobble: true
    });
    ctx6.fillStyle = "black";
    ctx6.strokeStyle = "";
    mainMenuButtons.play = drawButton({
      selected: window.gameStateMenu.selection === "Play",
      text: "Play",
      pos: { x: 60, y: 100 }
    });
    mainMenuButtons.settings = drawButton({
      selected: window.gameStateMenu.selection === "Settings",
      text: "Settings",
      pos: { x: 60, y: 128 }
    });
  }

  // src/mainMenuLogic.ts
  function updateMenu() {
    if (window.gameStateMenu.selection === "Play" && window.input.p1.buttonDown) {
      window.gameStateMenu.selection = "Settings";
    }
    if (window.gameStateMenu.selection === "Settings" && window.input.p1.buttonUp) {
      window.gameStateMenu.selection = "Play";
    }
    if (window.gameStateMenu.selection === "Play" && window.input.p1.buttonSelect) {
      window.gameState.screen = "Board";
    }
    if (mousePos.x > mainMenuButtons.play.x && mousePos.x < mainMenuButtons.play.x + mainMenuButtons.play.width && mousePos.y > mainMenuButtons.play.y && mousePos.y < mainMenuButtons.play.y + mainMenuButtons.play.height) {
      window.gameStateMenu.selection = "Play";
    }
    if (mousePos.x > mainMenuButtons.settings.x && mousePos.x < mainMenuButtons.settings.x + mainMenuButtons.settings.width && mousePos.y > mainMenuButtons.settings.y && mousePos.y < mainMenuButtons.settings.y + mainMenuButtons.settings.height) {
      window.gameStateMenu.selection = "Settings";
    }
  }

  // src/sprites.ts
  var ctx5 = getCtx();
  var canvas4 = getCanvas();
  function drawSprites(frame) {
    if (window.gameState.screen === "Menu") {
      updateMenu();
      drawMainMenu(ctx5);
    }
    if (window.gameState.screen === "Board") {
      updateBoard();
      drawBoard(ctx5);
    }
    drawMouse(ctx5);
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
    selection: "Play"
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
