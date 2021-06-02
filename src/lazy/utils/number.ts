/**
 * 比较一堆数据中最小的
 * @param a
 * @param args
 * @returns
 */
export function min(a: number, ...args: number[]): number {
  if (!args || args.length <= 0) return a;
  if (args.length === 1) {
    const b = args[0];
    return a > b ? b : a;
  }
  const b = min(args[0], ...args.slice(1));
  return min(a, b);
}

/**
 * 比较一组中最大的
 * @param a
 * @param args
 * @returns
 */
export function max(a: number, ...args: number[]): number {
  if (!args || args.length <= 0) return a;
  if (args.length === 1) {
    const b = args[0];
    return a < b ? b : a;
  }
  const b = max(args[0], ...args.slice(1));
  return max(a, b);
}
