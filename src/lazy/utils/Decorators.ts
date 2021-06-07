import { XPromise, Throttle, Debounce, waitTime } from "./Async";
import CacheArgs from "./Args";
import { set } from "./Object";
/**
 * @author [qianzhixiang]
 * @email [zxqian1991@163.com]
 * @create date 2019-12-12 10:04:00
 * @modify date 2019-12-12 10:04:00
 * @desc [自动绑定this]
 */

export function autobind(
  target: any,
  key: string,
  { configurable, enumerable, set, value }: PropertyDescriptor
) {
  return {
    configurable,
    enumerable,
    // value, 这个值设置后不能设置get set
    set,
    get() {
      return value.bind(this);
    },
  } as any;
}

export function pendding() {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const map = new Map<any, XPromise>();
    const value = descriptor.value;
    descriptor.value = function () {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const promise = new XPromise();
      map.set(this, promise);
      promise.wait().then(() => map.delete(this));
      return promise.resolve?.(value.apply(this, arguments));
    };
  };
}

export function throttle(timeout = 300) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    const map = new Map<any, Throttle>();
    descriptor.value = function (...args: any[]) {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const throttle = new Throttle(timeout);
      map.set(this, throttle);
      throttle.wait().then(() => map.delete(this));
      return throttle.execute(() => value.apply(this, args));
    };
  };
}

export function debounce(timeout = 300) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    const map = new Map<any, Debounce>();
    descriptor.value = function (...args: any[]) {
      if (map.has(this)) {
        return map.get(this)?.wait();
      }
      const debounce = new Debounce(timeout);
      map.set(this, debounce);
      debounce.wait().then(() => map.delete(this));
      return debounce.execute(() => value.apply(this, args));
    };
  };
}
/**
 * K Lazy所在的类的实例类型
 * T Lazy的返回数据类型
 * @param timeout cache 保存的时间
 * @returns
 */
export function lazy<K, T = any>(
  timeout: number = 1000 * 60,
  {
    level = 1,
    onSet,
    onGet,
    onTimeout,
  }: {
    level?: number;
    // 设置缓存的时候调用
    onSet?: (v: T, instance: K) => void;
    // 获取缓存的时候调用
    onGet?: (v: T, instance: K) => void;
    // 缓存超时的时候调用
    onTimeout?: (v: T, instance: K) => void;
  } = {}
) {
  return (target: Object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    const cacheMap = new Map<any, CacheArgs>();
    descriptor.value = function (this: K, ...args: any[]) {
      if (!cacheMap.has(this)) {
        cacheMap.set(this, new CacheArgs(timeout, level));
      }
      const cache = cacheMap.get(this)!;
      const argsData = cache.getArgs(args);
      if (argsData) {
        // 有这个数据 直接读历史数据

        const v: any = argsData.getValue();
        onGet?.(v, this);
        return v;
      }
      // 没有 就缓存
      const newArgsData = cache.addArgs(args, (v) => onTimeout?.(v, this));
      const v: any = value.apply(this, args);
      // 设置新值
      newArgsData.setValue(v);
      onSet?.(v, this);
      return newArgsData.getValue();
    };
  };
}

const countMap = new Map<any, number>();
export function loading<T = any>({
  name = "loading",
  ins,
}: { name?: string; ins?: T } = {}) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    const value = descriptor.value;
    descriptor.value = function () {
      const instance: any = ins || this;
      set(instance, name, true);
      countMap.set(instance, (countMap.get(instance) || 0) + 1);
      const _xp = new XPromise();
      _xp.wait().finally(() => {
        const count = countMap.get(instance)! - 1;
        if (count === 0) {
          countMap.delete(instance);
          set(instance, name, false);
        } else {
          countMap.set(instance, count);
        }
      });
      _xp.resolve?.(value.apply(this, arguments));
      return _xp.wait();
    };
  };
}
