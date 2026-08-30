import { getCanvas, getCtx } from "./utils";

export const mousePos = { x: 0, y: 0 };
const canvas = getCanvas();
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
document.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();

  // position within the displayed canvas, in CSS pixels
  const cssX = event.clientX - rect.left;
  const cssY = event.clientY - rect.top;

  // convert CSS pixels -> backing-store (game) pixels
  mousePos.x = cssX * (canvas.width / rect.width);
  mousePos.y = cssY * (canvas.height / rect.height);
});

document.addEventListener("mousedown", (event) => {
  event.preventDefault();
  if (window.gameState.screen === "Board" && event.button === 0) {
    window.input.p1.buttonFillSquare = true;
  }
  if (window.gameState.screen === "Board" && event.button === 2) {
    window.input.p1.buttonCrossSquare = true;
  }
  window.input.p1.buttonSelect = true;
});
document.addEventListener("mouseup", (event) => {
  event.preventDefault();
  if (window.gameState.screen === "Board" && event.button === 0) {
    window.input.p1.buttonFillSquare = false;
  }
  if (window.gameState.screen === "Board" && event.button === 2) {
    window.input.p1.buttonCrossSquare = false;
  }
  window.input.p1.buttonSelect = false;
});

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
