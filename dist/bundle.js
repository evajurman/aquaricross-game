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
    ctx: ctx5,
    letter,
    pos,
    fontFamily = "LuckiestGuy",
    fontSize,
    withStroke = false,
    noFill = false,
    bobble = false
  }) {
    ctx5.font = `${fontSize}px ${fontFamily}`;
    if (bobble) {
      let currentX = pos.x + ctx5.measureText(letter).width;
      let frame = getFrame();
      for (let char = letter.length - 1; char >= 0; char--) {
        const letterWidth = ctx5.measureText(letter[char]).width;
        const centerX = currentX;
        ctx5.save();
        ctx5.translate(centerX - letterWidth / 2, pos.y + 0);
        const angle = Math.cos(Math.sin((frame + char * 8) / 60 * (Math.PI / 4))) - 0.75;
        ctx5.rotate(angle);
        if (withStroke) {
          ctx5.strokeText(letter[char], -letterWidth / 2, 0);
        }
        if (!noFill) {
          ctx5.fillText(letter[char], -letterWidth / 2, 0);
        }
        ctx5.restore();
        currentX -= letterWidth;
      }
    } else {
      if (withStroke) {
        ctx5.strokeText(letter, pos.x, pos.y);
      }
      if (!noFill) {
        ctx5.fillText(letter, pos.x, pos.y);
      }
    }
  }

  // src/board.ts
  var boardOffsetX = 86;
  var boardOffsetY = 46;
  var cellSize = 10;
  var cellOffset = 1;
  var cellSquare = cellSize + cellOffset;
  function drawBoard(ctx5) {
    ctx5.fillStyle = "white";
    ctx5.strokeStyle = "black";
    ctx5.lineWidth = 0.2;
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
    const time = getHHMMSSDifference(/* @__PURE__ */ new Date(), window.gameStateBoard.startTime);
    for (let i = 0; i < time.length; i++) {
      drawLetter({
        ctx: ctx5,
        letter: `${time[i]}`,
        pos: {
          x: boardOffsetX - 42 + i * 8,
          y: boardOffsetY - 4
        },
        fontSize: 10
      });
    }
    drawFills(ctx5);
    drawCrosses(ctx5);
  }
  function drawFills(ctx5) {
    ctx5.fillStyle = window.gameStateBoard.mode === "Nonogram" ? "black" : "#4d56ff";
    for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
      const square = window.gameStateBoard.fills[i];
      ctx5.beginPath();
      ctx5.roundRect(
        boardOffsetX + square[0] * cellSquare + 1,
        boardOffsetY + square[1] * cellSquare + 1,
        cellSize - 2,
        cellSize - 2,
        2
      );
      ctx5.fill();
      ctx5.closePath();
    }
  }
  function drawCrosses(ctx5) {
    for (let i = 0; i < window.gameStateBoard.crosses.length; i++) {
      const square = window.gameStateBoard.crosses[i];
      ctx5.beginPath();
      ctx5.lineWidth = 1.5;
      ctx5.strokeStyle = "#663500";
      ctx5.moveTo(
        boardOffsetX + square[0] * cellSquare + 3,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx5.lineTo(
        boardOffsetX + square[0] * cellSquare + 7,
        boardOffsetY + square[1] * cellSquare + 7
      );
      ctx5.closePath();
      ctx5.stroke();
      ctx5.beginPath();
      ctx5.moveTo(
        boardOffsetX + square[0] * cellSquare + 7,
        boardOffsetY + square[1] * cellSquare + 3
      );
      ctx5.lineTo(
        boardOffsetX + square[0] * cellSquare + 3,
        boardOffsetY + square[1] * cellSquare + 7
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
      drawLetter({
        ctx: ctx5,
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
      drawLetter({
        ctx: ctx5,
        letter: `${clueCount}`,
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
    ctx5.fillStyle = "black";
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
      for (let j = 0; j < clueArray.clues.length; j++) {
        const isTen = `${clueArray.clues[clueArray.clues.length - 1 - j]}` === "10";
        drawLetter({
          ctx: ctx5,
          letter: `${clueArray.clues[clueArray.clues.length - 1 - j]}`,
          pos: {
            x: boardOffsetX + i * cellSquare + (isTen ? 0 : 3),
            y: boardOffsetY - j * (cellSquare / 1.2) - 3
          },
          fontSize: isTen ? 8 : 10
        });
      }
    }
    for (let i = 0; i < 10; i++) {
      let clueArray = { clues: [] };
      let continued = false;
      for (let j = 0; j < 10; j++) {
        if (hasTuple(window.gameStateBoard.solution, [j, i])) {
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
      for (let j = 0; j < clueArray.clues.length; j++) {
        const isTen = `${clueArray.clues[clueArray.clues.length - 1 - j]}` === "10";
        drawLetter({
          ctx: ctx5,
          letter: `${clueArray.clues[clueArray.clues.length - 1 - j]}`,
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
      letter: text,
      pos,
      fontSize,
      bobble: selected
    });
  }

  // src/mainMenu.ts
  var canvas3 = getCanvas();
  function drawMainMenu(ctx5) {
    ctx5.fillStyle = "white";
    ctx5.strokeStyle = "black";
    ctx5.lineWidth = 5;
    drawLetter({
      ctx: ctx5,
      letter: "Aquaricross",
      pos: { x: 16, y: 42 },
      fontSize: 34,
      withStroke: true,
      bobble: true
    });
    ctx5.fillStyle = "black";
    ctx5.strokeStyle = "";
    drawButton({
      selected: window.gameStateMenu.selection === "Play",
      text: "Play",
      pos: { x: 60, y: 100 }
    });
    drawButton({
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
    startTime: /* @__PURE__ */ new Date()
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
    const canvas5 = document.getElementById("canvas");
    const ctx5 = canvas5.getContext("2d");
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
