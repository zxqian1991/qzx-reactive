export function get<K = any, T = any>(
  v: T,
  ...args: (string | string[])[]
): K | undefined | null {
  // 没有任何传参 原路返回
  if (!args || args.length === 0) return v as any;
  const type = typeof v;
  if (v === null || type === "undefined") return v as any;
  if (args.length === 1 && typeof args[0] === "string") {
    return (v as any)[args[0] as string] as K;
  }
  let temp: any = v;
  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    temp = Array.isArray(value)
      ? get<T, K>(temp, ...value)
      : get<T, K>(temp, value);
    if (temp === null || temp === undefined) return temp as K;
  }
  return temp as K;
}

export function set<T, K = any>(v: T, key: string | number, value: K) {
  if (typeof v === "object") {
    (v as any)[key] = value;
  }
  return false;
}

export function equal<T = any, K = any>(v1: T, v2: K, level = 0) {
  const samePoint = (v1 as any) === (v2 as any);
  // 相同 true
  if (samePoint) return true;
  // 只比较一层 false 走到这里肯定不等了
  if (level === 0) return false;
  const t1 = typeof v1;
  const t2 = typeof v2;
  if (t1 === t2 && t1 === "object") {
    const keys1 = Object.keys(v1);
    const keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;
    for (let i in keys1) {
      const key = keys1[i];
      if (!equal((v1 as any)[key], (v2 as any)[key], level - 1)) return false;
    }
    return true;
  }
  return false;
}

export function omit<T>(
  v: Record<string, T>,
  ks: string | string[]
): Record<string, T>;
export function omit<T>(
  v: Record<string, T>,
  shouldOmit: (v: T, key: string) => boolean
): Record<string, T>;
export function omit<T>(
  v: Record<string, T>,
  condition: string | string[] | ((v: T, key: string) => boolean)
) {
  const result: Record<string, T> = {};
  for (let i in v) {
    // 是否需要过滤出去
    const _canOmit =
      typeof condition === "string"
        ? i === condition // 字符串是否相等
        : Array.isArray(condition)
        ? condition.some((c) => c === i) // 是否有这个字符串
        : typeof condition === "function"
        ? condition(v[i], i) // 是否满足条件
        : false;
    if (!_canOmit) {
      // 不需要推出  那就留存
      result[i] = v[i];
    }
  }
  return result;
}

export function pick<T>(
  v: Record<string, T>,
  ks: string | string[]
): Record<string, T>;
export function pick<T>(
  v: Record<string, T>,
  shouldOmit: (v: T, key: string) => boolean
): Record<string, T>;
export function pick<T>(
  v: Record<string, T>,
  condition: string | string[] | ((v: T, key: string) => boolean)
) {
  const result: Record<string, T> = {};
  for (let i in v) {
    // 是否需要过滤出去
    const canPick =
      typeof condition === "string"
        ? i === condition // 字符串是否相等
        : Array.isArray(condition)
        ? condition.some((c) => c === i) // 是否有这个字符串
        : typeof condition === "function"
        ? condition(v[i], i) // 是否满足条件
        : false;
    if (canPick) {
      // 不需要推出  那就留存
      result[i] = v[i];
    }
  }
  return result;
}
export function joinObject(
  object: Record<string, any>,
  s: string,
  h: (value: any, key: string) => string = (v, k) => `${k}=${v}`
) {
  let str = "";
  let isFirst = true;
  for (let i in object) {
    const v = h(object[i], i);
    str += !isFirst ? s : "" + v;
    if (isFirst) {
      isFirst = false;
    }
  }
  return str;
}
