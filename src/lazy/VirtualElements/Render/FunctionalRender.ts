import VirtualElement, { ElementResultType } from "..";
import {
  LazyTask,
  IDomElement,
  PropType,
  runExcludeTask,
  Lazyable,
} from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { formatResult, renderResult } from "../common";
import { VoidOrVoidFunction } from "../../types";

export type FunctionalComponentInited = {
  onCreated?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
  onMounted?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
  unMounted?: VoidFunction | VoidFunction[];
};

export type FunctionalOperate = {
  nextTick: (h: () => void) => void;
};

export type FunctionComponentStore<S extends Object = {}> = {
  inited: boolean; // 是否已经初始化
  unmount: (() => void)[]; // 卸载的时候的回调
  mounted: (() => void)[]; // 组件已装载
  nextticks: (() => void)[];
  state?: S;
  operate?: FunctionalOperate;
};

export type FunctionalComponent<P extends PropType, S = any> = (
  p?: P | undefined,
  state?: FunctionalComponentInited | undefined,
  q?: FunctionalOperate | undefined
) => ElementResultType;

let FunctionalComponentIndex = 0;
let TempRunningFunctionalComponent = 0;
const FunctionalComponentStoreMap = new Map<number, FunctionComponentStore>();

export default function FunctionalRender(virtualElement: VirtualElement) {
  return new LazyTask<IDomElement[]>(
    (o1) => {
      o1.except(() => (virtualElement.Prop = new LazyProp(virtualElement)));
      // 设置当前函数组件的一个唯一ID
      const virtualElementFunctionalIndex = ++FunctionalComponentIndex;
      const prop = virtualElement.Prop?.getProp();
      const effectsValue: any[][] = [];
      o1.addSubTask(
        new LazyTask((o2) => {
          // 执行函数 支持hooks基础功能
          const result = execFunctionalComponent(
            virtualElementFunctionalIndex,
            (data) =>
              (virtualElement.component as FunctionalComponent<PropType>)(
                prop,
                o2.runTime === 1 ? undefined : data.state,
                o2.runTime === 1 ? undefined : data.operate
              )
          );
          if (o2.runTime === 1) {
            // 渲染结果
            const fr = runExcludeTask(() => {
              const fr = formatResult(result);
              o1.setData(renderResult(fr));
              return fr;
            });
            virtualElement.result = fr;
            // 获取数据
            const data = FunctionalComponentStoreMap.get(
              virtualElementFunctionalIndex
            );
            // 调用初始化数据
            if (data) {
              data.mounted.forEach((u) => u());
            }
          } else {
            const data = FunctionalComponentStoreMap.get(
              virtualElementFunctionalIndex
            );
            diffResult(
              o2.id,
              formatResult(result),
              virtualElement.result!
            ).then(({ result: Res, elements }) => {
              virtualElement.result = Res;
              if (elements && elements.length > 0) {
                o1.setData(elements);
              }
            });
          }
          return () => {
            const data = FunctionalComponentStoreMap.get(
              virtualElementFunctionalIndex
            );
            data?.unmount.forEach((u) => u());
            FunctionalComponentStoreMap.delete(virtualElementFunctionalIndex);
          };
        })
      );
      return () => {
        virtualElement.Prop?.stop();
      };
    },
    {
      maxRunTime: 1,
    }
  );
}

/**
 * 执行函数组件时所作的操作
 * execFunctionalComponent(1, () => SomeCom(prop))
 * @param func
 */
function execFunctionalComponent<P extends PropType>(
  index: number,
  func: (data: FunctionComponentStore) => ElementResultType
) {
  // 初始化函数组件的数据
  const lastRunningComponent = TempRunningFunctionalComponent;
  TempRunningFunctionalComponent = index;
  if (!FunctionalComponentStoreMap.has(TempRunningFunctionalComponent)) {
    FunctionalComponentStoreMap.set(TempRunningFunctionalComponent, {
      inited: false,
      unmount: [],
      mounted: [],
      nextticks: [],
    });
  }
  // 执行
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  data.operate = {
    nextTick: (h: () => void) => {
      data.nextticks.push(h);
    },
  };
  const result = func(data);
  if (!data.inited) {
    data.inited = true;
  }
  TempRunningFunctionalComponent = lastRunningComponent;
  return result;
}

function assertInFunctionComponent() {
  if (!TempRunningFunctionalComponent)
    throw new Error("useState only support functional component!");
}

// 使用响应值
export function useState<T extends Record<string, any>>(initialValue: T): T {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (data.inited) {
    return data.state as T;
  } else {
    data.state = Lazyable(initialValue);
    return data.state as T;
  }
}

// 使用初始化钩子
function useCreated(func: () => void | (() => void)) {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    const result = func();
    if (result && typeof result === "function") {
      data.unmount.push(result);
    }
  }
}

// 传递给函数组件的第三个参数
export function useLife(init?: FunctionalComponentInited) {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    if (init) {
      if (init.onCreated) {
        if (Array.isArray(init.onCreated)) {
          useCreated(() => {
            const rs = (init.onCreated as (() => VoidOrVoidFunction)[]).map(
              (h) => h()
            );
            return () => rs.forEach((r) => r && r());
          });
        } else {
          useCreated(init.onCreated);
        }
      }
      if (init.onMounted) {
        if (Array.isArray(init.onMounted)) {
          useMounted(() => {
            const rs = (init.onMounted as (() => VoidOrVoidFunction)[]).map(
              (h) => h()
            );
            return () => rs.forEach((r) => r && r());
          });
        } else {
          useMounted(init.onMounted);
        }
      }
      if (init.unMounted) {
        if (Array.isArray(init.unMounted)) {
          useUnMounted(() =>
            (init.unMounted as (() => VoidOrVoidFunction)[]).map((h) => h())
          );
        } else {
          useUnMounted(init.unMounted);
        }
      }
    }
  }
}

// 下载时使用的函数
function useUnMounted(func: () => void) {
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    // data.onUnmount = func;
    data.unmount.push(func);
  }
}

function useMounted(func: () => void | (() => void)) {
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    data.unmount.push(() => {});
    const index = data.unmount.length - 1;
    data.mounted.push(() => {
      const res = func();
      if (res && typeof res === "function") {
        data.unmount[index] = res;
      }
    });
  }
}
