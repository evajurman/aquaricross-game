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
  delayLength = 6,
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

export function getHHMMSSDifference(date1: Date, date2: Date) {
  // Get the absolute difference in milliseconds
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());

  // Convert milliseconds into total seconds
  const totalSeconds = Math.floor(diffInMs / 1000);

  // Calculate minutes and seconds
  const overNintyNineMinutes = totalSeconds >= 5940;
  const minutes = Math.floor((totalSeconds % 5940) / 60);
  const seconds = totalSeconds % 60;

  // Format to HH:MM:SS using String.prototype.padStart()
  const pad = (num: number) => String(num).padStart(2, "0");

  if (overNintyNineMinutes) {
    return "99:99";
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

export function randomIndex<T>(list: T[]) {
  return Math.floor(Math.random() * list.length);
}

export function randomItem<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function last<T>(list: T[]) {
  return list[list.length - 1];
}
