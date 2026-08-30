import { drawButton } from "./drawButton";
import { drawLetter } from "./drawLetter";
import { returnFromSettings, settingsSelection } from "./settingsLogic";
import { getCtx } from "./utils";

const buttons = {
  Up: "buttonUp",
  Down: "buttonDown",
  Right: "buttonRight",
  Left: "buttonLeft",
  Select: "buttonSelect",
  Back: "buttonBack",
  "Fill Square": "buttonFillSquare",
  "Cross Square": "buttonCrossSquare",
  "Mode Switch": "buttonShiftBoard",
};

export const buttonsArray = Object.keys(buttons);

export function drawSettings(ctx: CTX) {
  ctx.fillStyle = "black";
  const fontSize = 12;
  for (let i = 0; i < buttonsArray.length; i++) {
    if (settingsSelection === i) {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }
    drawLetter({
      ctx: getCtx(),
      letter: buttonsArray[i],
      pos: { x: 20, y: 40 + (fontSize + 1) * i },
      fontSize,
    });
    // input button
    // @ts-ignore
    let key = window.keySettings[buttons[buttonsArray[i]]];
    key = key === " " ? "space" : key;
    drawButton({
      selected: false,
      // @ts-ignore
      text: key,
      pos: { x: 120, y: 40 + (fontSize + 1) * i },
      fontSize,
    });
    // test button
    drawLetter({
      ctx,
      // @ts-ignore
      letter: window.input.p1[buttons[buttonsArray[i]]],
      pos: { x: 200, y: 40 + (fontSize + 1) * i },
      fontSize,
    });

    // drawBackButton
    if (returnFromSettings > 0) {
      const gradient = ctx.createLinearGradient(2, 0, 35, 0);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(returnFromSettings / 100, "white");
      gradient.addColorStop((returnFromSettings + 1) / 100, "black");
      gradient.addColorStop(1, "black");
      ctx.fillStyle = "orange";
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(6, 16);
      ctx.lineTo(15, 6);
      ctx.lineTo(15, 13);
      ctx.lineTo(22, 6);
      ctx.lineTo(35, 12);
      ctx.lineTo(32, 18);
      ctx.lineTo(23, 12);
      ctx.lineTo(15, 18);
      ctx.lineTo(15, 23);
      ctx.lineTo(6, 16);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}
