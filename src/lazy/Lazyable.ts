import { Component } from "./Component";
/**是否是代理对象 */
export const LAZYABLE_FLAG = Symbol("_$$__$$__is_lazyable");
/**是否是一个已经proxy */
export const LAZYABLED_FLAG = Symbol("_$$__$$__is_lazyabled");
/** 代理对象的原生对象属性标识 */
export const ORIGIN_TARGET_FLAG = Symbol("_$$__$$__origin_target_flag");

export type LazyableGetHandlerType = (
  object: any,
  key: string | number | symbol,
  value: any
) => void;
export type LazyableSetHandlerType = (
  object: any,
  key: string | number | symbol,
  value: any,
  oldValue: any,
  isAdd: boolean
) => void;
export type LazyableDeleteHandlerType = (
  object: any,
  key: string | number | symbol,
  oldValue: any
) => void;

export type LazyableAddHandlerType = (
  object: any,
  key: string | number | symbol,
  value: any
) => void;

export type LazyableHandlerType =
  | LazyableGetHandlerType
  | LazyableSetHandlerType
  | LazyableDeleteHandlerType
  | LazyableAddHandlerType;
export type LazyableOptType = "get" | "set" | "add" | "delete";

/**
 * 判断一个对象是否已经被代理过
 * @param value
 * @returns
 */
export function hasTargetLazyabled<T>(value: T): boolean {
  if (!value || typeof value !== "object") return false;
  const origin = getLazyableRawData(value);
  const proto = (origin as any)?.__proto__;
  if (!proto || !proto[LAZYABLE_FLAG]) return false;
  return true;
}
export function isLazyabledData(v: any): boolean {
  return v && v[LAZYABLED_FLAG];
}
/**
 * 代理一个对象让它变得可以被监听
 * @param value 需要被监听的值
 */
type LazyableKeyType = {
  include?: (string | symbol)[];
  exclude?: (string | symbol)[];
};
function canKeyLazyable(
  k: string | symbol,
  { include, exclude }: LazyableKeyType = {}
) {
  if (exclude && exclude.includes(k)) return false;
  if (include) {
    return include.includes(k);
  }
  return true;
}

const GET_HANDLERS_MAP = new Map<any, Set<LazyableGetHandlerType>>();
const SET_HANDLERS_MAP = new Map<any, Set<LazyableSetHandlerType>>();
const DELETE_HANDLERS_MAP = new Map<any, Set<LazyableDeleteHandlerType>>();
const ADD_HANDLERS_MAP = new Map<any, Set<LazyableSetHandlerType>>();
function getHandlersMapByType(type: LazyableOptType) {
  switch (type) {
    case "get":
      return GET_HANDLERS_MAP;
    case "set":
      return SET_HANDLERS_MAP;
    case "delete":
      return DELETE_HANDLERS_MAP;
    case "add":
      return ADD_HANDLERS_MAP;
  }
}
function onLazyableOpt(
  map: Map<any, Set<any>>,
  t: any = "default",
  ...args: any[]
) {
  map.get(Raw(t))?.forEach((h) => h(...args));
}

const LAZYABLE_GET_TRANSFORMERS: ((
  v: any,
  t: any,
  k: string | number | symbol,
  r?: any
) => any)[] = [];

// 转换获取值的逻辑
export function transformLazyable(
  h: (v: any, t: any, k: string | number | symbol, r?: any) => any
) {
  LAZYABLE_GET_TRANSFORMERS.push(h);
}

export function Lazyable<T extends object>(
  value: T,
  opt: LazyableKeyType = {}
): T {
  if (!value) return value;
  if (typeof value !== "object") return value;
  if (hasTargetLazyabled(value))
    return (getLazyableRawData(value) as any)?.[LAZYABLE_FLAG];
  const R: any = new Proxy(value, {
    get(t, k, r) {
      if (k === ORIGIN_TARGET_FLAG) return t;
      if (k === LAZYABLED_FLAG) return true;
      const v = Reflect.get(t, k, r);
      if (!canKeyLazyable(k, opt)) {
        return v;
      }
      const Rv = hasTargetLazyabled(v)
        ? (getLazyableRawData(v) as any)?.[LAZYABLE_FLAG] // 已经是代理对象了 获取这个对象存储的代理结果
        : k !== "__proto__" &&
          (v?.__proto__ === ([] as any).__proto__ ||
            v?.__proto__ === ({} as any).__proto__) // 是一个普通的对象而非一个类
        ? Lazyable(v) // 响应化
        : v;
      onLazyableOpt(GET_HANDLERS_MAP, t, t, k, Rv);
      onLazyableOpt(GET_HANDLERS_MAP, "default", t, k, Rv);
      return LAZYABLE_GET_TRANSFORMERS.reduce(
        (lastv, h) => h(lastv, t, k, R),
        Rv
      );
    },
    set(t, k, v, r) {
      const isAdd = !t.hasOwnProperty(k);
      const oldValue = Reflect.get(t, k);
      // 将原生的值放进去
      const res = Reflect.set(t, k, getLazyableRawData(v), r);
      onLazyableOpt(SET_HANDLERS_MAP, t, t, k, v, oldValue, isAdd);
      onLazyableOpt(SET_HANDLERS_MAP, "default", t, k, v, oldValue, isAdd);
      if (isAdd) {
        onLazyableOpt(ADD_HANDLERS_MAP, t, t, k, v, oldValue, isAdd);
        onLazyableOpt(ADD_HANDLERS_MAP, "default", t, k, v, oldValue, isAdd);
      }
      return res;
    },
    deleteProperty(t, p) {
      const oldValue = Reflect.get(t, p);
      const res = Reflect.deleteProperty(t, p);
      onLazyableOpt(DELETE_HANDLERS_MAP, t, t, p, oldValue);
      onLazyableOpt(DELETE_HANDLERS_MAP, "default", t, p, oldValue);

      return res;
    },
  });
  // 在原生对象中记录这个代理对象 保证所有的原生对象其实指向同一个代理对象 是否有必要 有待实践
  (value as any).__proto__ = new Proxy(Array.isArray(value) ? [] : {}, {
    get(t, k, v) {
      if (k === LAZYABLE_FLAG) return R;
      return Reflect.get(t, k, v);
    },
  });
  return R;
}

/**
 * 获取一个被代理过的对象的原始数据
 * @param value
 * @returns
 */
export function getLazyableRawData<T>(value: T): T {
  return (value as any)?.[ORIGIN_TARGET_FLAG] || value;
}

export const Raw = getLazyableRawData;

/**
 * 让一个值变得可被代理
 * @param value
 */

export function Ref<T>(value: T): { value: T } {
  return Lazyable({ value });
}

export function onLazyable(
  type: "get",
  t: any,
  h: LazyableGetHandlerType
): () => void;
export function onLazyable(type: "get", h: LazyableGetHandlerType): () => void;
export function onLazyable(
  type: "set",
  t: any,
  h: LazyableSetHandlerType
): () => void;
export function onLazyable(type: "set", h: LazyableSetHandlerType): () => void;
export function onLazyable(
  type: "add",
  t: any,
  h: LazyableAddHandlerType
): () => void;
export function onLazyable(type: "add", h: LazyableAddHandlerType): () => void;
export function onLazyable(
  type: "delete",
  t: any,
  h: LazyableDeleteHandlerType
): () => void;
export function onLazyable(
  type: "delete",
  h: LazyableDeleteHandlerType
): () => void;
export function onLazyable(type: LazyableOptType, t: any, h?: any) {
  if (!h) {
    const temp = t;
    t = "default";
    h = temp;
  } else {
    t = Raw(t);
  }
  const map = getHandlersMapByType(type);
  if (!map) return () => {};
  if (!map.has(t)) {
    map.set(t, new Set());
  }
  map.get(t)?.add(h);
  return () => {
    map.get(t)?.delete(h);
    if (map.get(t)?.size === 0) map.delete(t);
  };
}

export const STATE_FLAG = Symbol("state_flag");
export function Stateable() {
  return function <T extends new (...args: any[]) => any>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        const states = (target.prototype[STATE_FLAG] as string[]) || [];
        const data = Lazyable({} as Record<string, any>);
        states.forEach((p) => {
          data[p] = this[p];
          Object.defineProperty(this, p, {
            get() {
              return Reflect.get(data, p);
            },
            set(v) {
              return Reflect.set(data, p, v);
            },
          });
        });
      }
    };
  };
}

export function State() {
  return function (target: any, property: string) {
    // 获取描述符
    if (!target[STATE_FLAG]) {
      target[STATE_FLAG] = [];
    }
    target[STATE_FLAG].push(property);
  };
}
