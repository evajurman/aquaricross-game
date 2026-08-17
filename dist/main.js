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
  function delayAction(callback, delayLength = 5) {
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

  // src/board.ts
  function drawBoard(ctx5) {
    const boardOffsetX = 64;
    const boardOffsetY = 32;
    const cellSize = 10;
    const cellOffset = 1;
    const cellSquare = cellSize + cellOffset;
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
      ctx5.lineWidth = 1;
      ctx5.strokeRect(
        boardOffsetX - 1,
        boardOffsetY - 1,
        cellSquare * 5 + 1,
        cellSquare * 5 + 1
      );
      ctx5.strokeRect(
        cellSquare * 5 + boardOffsetX - 1,
        boardOffsetY - 1,
        cellSquare * 5 + 1,
        cellSquare * 5 + 1
      );
      ctx5.strokeRect(
        boardOffsetX - 1,
        cellSquare * 5 + boardOffsetY - 1,
        cellSquare * 5 + 1,
        cellSquare * 5 + 1
      );
      ctx5.strokeRect(
        cellSquare * 5 + boardOffsetX - 1,
        cellSquare * 5 + boardOffsetY - 1,
        cellSquare * 5 + 1,
        cellSquare * 5 + 1
      );
      ctx5.strokeRect(
        boardOffsetX - 1,
        boardOffsetY - 1,
        cellSquare * 10 + 1,
        cellSquare * 10 + 1
      );
      ctx5.fillStyle = "black";
      for (let i = 0; i < window.gameStateBoard.fills.length; i++) {
        const square = window.gameStateBoard.fills[i];
        ctx5.beginPath();
        ctx5.roundRect(
          boardOffsetX + square[0] * cellSquare + 2,
          boardOffsetY + square[1] * cellSquare + 2,
          cellSize - 4,
          cellSize - 4,
          2
        );
        ctx5.fill();
        ctx5.closePath();
      }
      for (let i = 0; i < window.gameStateBoard.crosses.length; i++) {
        const square = window.gameStateBoard.crosses[i];
        ctx5.beginPath();
        ctx5.lineWidth = 1.5;
        ctx5.strokeStyle = "black";
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
    if (window.gameStateBoard.mode === "Aquarium") {
      ctx5.lineWidth = 1;
    }
    ctx5.lineWidth = 2;
    const [cursorX, cursorY] = window.gameStateBoard.selection;
    ctx5.strokeRect(
      boardOffsetX + cursorX * cellSquare,
      boardOffsetY + cursorY * cellSquare,
      cellSize,
      cellSize
    );
  }

  // src/boardLogic.ts
  var shouldClearSquares = false;
  var shouldClearCrosses = false;
  function updateBoard() {
    if (window.input.p1.buttonShiftBoard) {
      delayAction((state) => {
        state.gameStateBoard.mode = state.gameStateBoard.mode === "Nonogram" ? "Aquarium" : "Nonogram";
      }, 10);
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
    if (!window.input.p1.buttonFillSquare) {
      shouldClearSquares = false;
    }
    if (window.input.p1.buttonFillSquare) {
      shouldClearSquares = hasTuple(window.gameStateBoard.fills, window.gameStateBoard.selection) && window.input.p1.buttonFillSquare !== window.input.p1Previous.buttonFillSquare || shouldClearSquares && window.input.p1.buttonFillSquare === window.input.p1Previous.buttonFillSquare;
      if (shouldClearSquares) {
        window.gameStateBoard.fills = removeTuple(
          window.gameStateBoard.fills,
          window.gameStateBoard.selection
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
      shouldClearCrosses = hasTuple(
        window.gameStateBoard.crosses,
        window.gameStateBoard.selection
      ) && window.input.p1.buttonCrossSquare !== window.input.p1Previous.buttonCrossSquare || shouldClearCrosses && window.input.p1.buttonCrossSquare === window.input.p1Previous.buttonCrossSquare;
      if (shouldClearCrosses) {
        window.gameStateBoard.crosses = removeTuple(
          window.gameStateBoard.crosses,
          window.gameStateBoard.selection
        );
      } else {
        window.gameStateBoard.crosses.push([...window.gameStateBoard.selection]);
      }
      window.gameStateBoard.crosses = uniqueTuples(window.gameStateBoard.crosses);
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
      let currentX = pos.x;
      let frame = getFrame();
      for (let char = 0; char < letter.length; char++) {
        const letterWidth = ctx5.measureText(letter[char]).width;
        const centerX = currentX - letterWidth / 4;
        ctx5.save();
        ctx5.translate(centerX + letterWidth - 2, pos.y + 0);
        const angle = Math.cos(Math.sin((frame + char * 8) / 60 * (Math.PI / 4))) - 0.75;
        ctx5.rotate(angle);
        if (withStroke) {
          ctx5.strokeText(letter[char], -letterWidth / 2, 0);
        }
        if (!noFill) {
          ctx5.fillText(letter[char], -letterWidth / 2, 0);
        }
        ctx5.restore();
        currentX += letterWidth;
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
      letter: "AQUARICROSS",
      pos: { x: 10, y: 42 },
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
    screen: "Board"
  };
  window.gameStateBoard = {
    mode: "Nonogram",
    selection: [0, 0],
    fills: [],
    crosses: [],
    solution: [],
    aquariums: [],
    nonogramHintsRows: [],
    nonogramHintsCols: [],
    aquariumHintsRows: [],
    aquariumHintsCols: []
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
        window.input.p1Previous[inputKey] = false;
        window.input.p1[inputKey] = true;
      }
    }
  });
  document.addEventListener("keyup", (event) => {
    for (let inputKey of Object.keys(window.keySettings)) {
      if (window.keySettings[inputKey] === event.key) {
        window.input.p1[inputKey] = false;
        window.input.p1Previous[inputKey] = true;
      }
    }
  });
  start();
})();
