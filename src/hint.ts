export function testFills(hints: number[], fills: number[]): boolean[] {
  const result = hints.map((__, i) => {
    return hints[i] === fills[i];
  });
  if (result.every(Boolean)) {
    return result;
  } else {
    return hints.map(() => false);
  }
}
