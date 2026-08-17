export function getCtx() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return ctx;
}

export function getCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  return canvas;
}

export function getFrame(): number {
  return window.frameNumber;
}

let delay = 0;
export function delayAction(
  callback: (state: Window & typeof globalThis) => void,
  delayLength = 5,
) {
  if (delay === 0 || !(delay + delayLength > window.frameNumber)) {
    callback(window);
    delay = window.frameNumber;
  }
}

export function uniqueTuples<T>(list: T[]) {
  const uniqueTuples = Array.from(
    new Set(list.map((tuple) => JSON.stringify(tuple))),
  ).map((str) => JSON.parse(str));
  return uniqueTuples;
}

export function hasTuple<T>(list: T[], item: T) {
  return list.length === uniqueTuples([...list, item]).length;
}

export function removeTuple<T>(list: T[], item: T) {
  return list.filter((i) => {
    if (JSON.stringify(i) === JSON.stringify(item)) {
      return false;
    }
    return true;
  });
}
