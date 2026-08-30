import { boardOffsetX, boardOffsetY, cellOffset, cellSize } from "./board";
import { getCanvas, getCtx } from "./utils";

export const mousePos = { x: 200, y: 200 };
const canvas = getCanvas();

function updatePos(event: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  const cssX = event.clientX - rect.left;
  const cssY = event.clientY - rect.top;
  mousePos.x = cssX * (canvas.width / rect.width);
  mousePos.y = cssY * (canvas.height / rect.height);
}

export function drawMouse(ctx: CTX) {
  ctx.strokeStyle = "orange";
  ctx.fillStyle = "yellow";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mousePos.x, mousePos.y);
  ctx.lineTo(mousePos.x + 7, mousePos.y + 6);
  ctx.lineTo(mousePos.x + 3, mousePos.y + 7);
  ctx.lineTo(mousePos.x, mousePos.y + 10);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// this is more for mobile
export let pointerMode: "fill" | "cross" = "fill";

document.addEventListener("pointermove", updatePos);

document.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  updatePos(event);
  const mouseInBoardX =
    mousePos.x > boardOffsetX &&
    mousePos.x < boardOffsetX + (cellSize + cellOffset) * 11;
  const mouseInBoardY =
    mousePos.y > boardOffsetY &&
    mousePos.y < boardOffsetY + (cellSize + cellOffset) * 11;
  const mouseInBoard = mouseInBoardX && mouseInBoardY;
  if (
    window.gameState.screen === "Board" &&
    event.button === 0 &&
    mouseInBoard
  ) {
    if (pointerMode === "fill") {
      window.input.p1.buttonFillSquare = true;
    }
    if (pointerMode === "cross") {
      window.input.p1.buttonCrossSquare = true;
    }
  }
  if (
    window.gameState.screen === "Board" &&
    event.button === 2 &&
    mouseInBoard
  ) {
    if (pointerMode === "fill") {
      window.input.p1.buttonCrossSquare = true;
    }
    if (pointerMode === "cross") {
      window.input.p1.buttonFillSquare = true;
    }
  }
  const isInPointerModeSection =
    mousePos.x > 40 && mousePos.y > 9 && mousePos.x < 70 && mousePos.y < 31;
  if (window.gameState.screen === "Board" && isInPointerModeSection) {
    pointerMode = pointerMode === "fill" ? "cross" : "fill";
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
  window.input.p1.buttonSelect = false;
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
