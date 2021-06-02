import { min } from "./number";

export interface IArrayDiff<T> {
  deleted: T[];
  added: T[];
  keep: T[];
}
/**
 * 比较两个数组的异同
 * @param oData 对比的数组(旧的，基数)
 * @param nData 对比的数组
 * @param getValue 获取数组的key
 * @returns
 */
export function findArrayDiff<T, K>(
  oData: T[],
  nData: T[],
  getValue: (v: T) => K = (v) => v as any
) {
  const oMap = new Map<K, T>();
  oData.forEach((d) => oMap.set(getValue(d), d));
  const result: IArrayDiff<T> = {
    deleted: [],
    added: [],
    keep: [],
  };
  nData.forEach((d) => {
    const v = getValue(d);
    if (!oMap.has(v)) {
      result.added.push(d);
    } else {
      result.keep.push(d);
    }
    oMap.delete(v);
  });
  oMap.forEach((d) => result.deleted.push(d));
  return result;
}

/**
 * 自动生成数组成
 * @param size 数组的大小
 * @param gene 生成数组的逻辑
 * @returns
 */
export function generateArray<T>(size: number, gene: (index: number) => T) {
  const arr: T[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(gene(i));
  }
  return arr;
}

/**
 * 将一堆数组转换成有关系的树
 * @param nodes 所有的节点
 * @param param1 生成树的逻辑
 * @returns
 */
export function generateTreeByArray<T, K = T>(
  nodes: T[],
  {
    id = "id",
    children = "children",
    parent = "parent_id",
  }: { children?: string; id?: string; parent?: string }
): K[] {
  const res: K[] = [];
  const map = new Map<any, any>();
  const cache = new Map<any, any[]>();
  for (let i in nodes) {
    const node: any = nodes[i];
    // 这表示 之前有人用到我了
    if (cache.has(node[id])) {
      node[children] = cache.get(node[id]);
      // 可以删掉了 不需要了
      cache.delete(node[id]);
    }
    // 不存在父节点
    const parentId = node[parent];
    if (!parentId) {
      res.push(node);
    } else {
      // 存在父节点，我要找到它的父节点
      if (map.has(parentId)) {
        const parentNode = map.get(parentId);
        if (!parentNode[children]) {
          parentNode[children] = [];
        }
        parentNode[children].push(node);
      } else {
        // 糟了，map里面还没有这个父节点，那么我存储下
        if (!cache.has(parentId)) {
          cache.set(parentId, []);
        }
        // 推进去
        cache.get(parentId)?.push(node);
      }
    }
    map.set(node[id], node);
  }
  return res;
}

/**
 * 将一个数组转换成一个map
 * @param arr 数组
 * @param getKey 每个item的key值获取逻辑
 * @returns
 */
export function toMap<T, K>(arr: T[], getKey: (i: T) => K) {
  const map = new Map<K, T>();
  arr.forEach((i) => {
    const key = getKey(i);
    map.set(key, i);
  });
  return map;
}

/**
 * 讲一个数组以size为一组组成新的数组
 * @param arr 需要处理的函数
 * @param size 组的大小
 * @returns
 */
export function chunk<T>(arr: T[], size: number) {
  const res: T[][] = [];
  let temp: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const tail = i % size;
    if (tail === 0) {
      temp = [];
      res.push(temp);
    }
    temp.push(arr[i]);
  }
  return res;
}

/**
 * 将一个复杂的嵌套着的数组展开
 * @param arr
 * @param level
 * @returns
 */
export function flattern<K = any, T = any>(arr: T[], level = 1): K[] {
  if (level === 0) return arr as any;
  const res: K[] = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flattern<K, T>(value, level - 1).forEach((t) => res.push(t));
    } else {
      res.push(value as any);
    }
  }
  return res;
}

/**
 * 把a2的值 赋值给a1
 * 希望的是直接改变里面的内容
 * 1. a1比较长的话 需要把多出的元素删除
 * 2. a1比较短的话 需要新增元素
 * @param a1
 * @param a2
 * @returns
 */
export function mergeArray(a1: any[], a2: any[]) {
  const l1 = a1.length;
  const l2 = a2.length;
  const minL = min(l1, l2);
  for (let i = 0; i < minL; i++) {
    a1[i] = a2[i];
  }
  // 说明a2小一点
  if (l1 > minL) {
    for (let i = minL; i < l1; i++) {
      a1.pop();
    }
  }
  // 说明a1小一点
  if (l2 > minL) {
    for (let i = minL; i < l2; i++) {
      a1.push(a2[i]);
    }
  }
  return a1;
}
