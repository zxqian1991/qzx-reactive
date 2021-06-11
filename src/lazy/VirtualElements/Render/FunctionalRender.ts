import VirtualElement, { ElementResultType } from "..";
import { LazyTask, PropType, runExcludeTask } from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { formatResult, renderResult } from "../common";
import { VoidOrVoidFunction } from "../../types";
import { Lazyable, Raw } from "../../Lazyable";
import { useService } from "../../LazyService";

export type FunctionalComponentInited = {
  onCreated?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
  onMounted?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
  onUnMounted?: VoidFunction | VoidFunction[];
};

export type FunctionalOperate = {
  nextTick: (h: () => void) => void;
};

export type FunctionComponentStore<T = any, C = any, S = any, M = any> = {
  inited: boolean; // 是否已经初始化
  unmount: (() => void)[]; // 卸载的时候的回调
  mounted: (() => void)[]; // 组件已装载
  nextticks: (() => void)[];
  context: M & {
    state: T;
    computed: ComputedType<C>;
    services: ServiceType<S>;
  };
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
  return new LazyTask(
    (o1) => {
      o1.except(() => (virtualElement.Prop = new LazyProp(virtualElement)));
      // 设置当前函数组件的一个唯一ID
      const virtualElementFunctionalIndex = ++FunctionalComponentIndex;
      const prop = virtualElement.Prop?.getProp();
      o1.addSubTask(
        new LazyTask((o2) => {
          // 执行函数 支持hooks基础功能
          const result = execFunctionalComponent(
            virtualElementFunctionalIndex,
            (data) =>
              (virtualElement.component as FunctionalComponent<PropType>)(
                prop,
                o2.runTime === 1 ? undefined : data.context
              )
          );
          if (o2.runTime === 1) {
            // 渲染结果
            const fr = runExcludeTask(() => {
              const fr = formatResult(result);
              renderResult(fr, virtualElement.position!);
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
            const { result: Res } = diffResult(
              o2.id,
              formatResult(result),
              virtualElement.result!
            );
            virtualElement.result = Res;
          }
        })
      );
      return () => {
        virtualElement.Prop?.stop();
        const data = FunctionalComponentStoreMap.get(
          virtualElementFunctionalIndex
        );
        data?.unmount.forEach((u) => u());
        FunctionalComponentStoreMap.delete(virtualElementFunctionalIndex);
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
      context: {},
    });
  }
  // 执行
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
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

// 使用初始化钩子
export function useCreated(func: () => void | (() => void)) {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    const result = func();
    if (result && typeof result === "function") {
      data.unmount.push(result);
    }
  }
}

// 下载时使用的函数
export function useUnMounted(func: () => void) {
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    // data.onUnmount = func;
    data.unmount.push(func);
  }
}

export function useMounted(func: () => void | (() => void)) {
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

export type ComputedType<T> = T extends Record<string, any>
  ? {
      [p in keyof T]: ReturnType<T[p]>;
    }
  : T;
export type ServiceType<T> = T extends Record<
  string,
  new (...args: any[]) => any
>
  ? {
      [p in keyof T]: InstanceType<T[p]>;
    }
  : T;

export type ComponentLifeCycle = {
  onCreated?: () => VoidOrVoidFunction;
  onMounted?: () => VoidOrVoidFunction;
  onUnMounted?: VoidFunction;
};

type FunctionContextType<T, C, S, M> = M & {
  state: T;
  computed: ComputedType<C>;
  services: ServiceType<S>;
};

export type FunctionalComponentConfig<T, C, S, M> = {
  state?: T;
  computed?: C & ThisType<FunctionContextType<T, C, S, M>>;
  services?: S & ThisType<FunctionContextType<T, C, S, M>>;
  lifeCycle?: ComponentLifeCycle & ThisType<FunctionContextType<T, C, S, M>>;
  methods?: M & ThisType<FunctionContextType<T, C, S, M>>;
};

export function useCtx<
  T extends Record<string, any>,
  C extends Record<string, (...args: any[]) => any>,
  S extends Record<string, new (...args: any[]) => any>,
  M extends Record<string, (...args: any[]) => any>
>(
  option: FunctionalComponentConfig<T, C, S, M>
): FunctionContextType<T, C, S, M> {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    const state = Lazyable(option.state || {});
    const services: ServiceType<S> = {} as any;
    const _computed = Lazyable({} as any);
    const computed = new Proxy(_computed, {
      get(t, k, r) {
        // 已经有这个属性了 直接用
        if (Raw(t).hasOwnProperty(k)) {
          return Reflect.get(t, k, r);
        } else {
          const task = new LazyTask(
            () => {
              _computed[k] = option?.computed?.[k as string]?.apply(ctx);
            },
            {
              autoAppendAsSubTask: false,
            }
          );
          // 卸载的时候 解除监听
          data.unmount.push(() => task.stop());
          return Reflect.get(t, k, r);
        }
      },
      set() {
        throw new Error("computed value can't be set");
      },
    });
    const ctx: any = {
      state,
      // 无法被复制
      computed,
      services,
    };
    if (option.lifeCycle) {
      for (let life in option.lifeCycle) {
        switch (life) {
          case "onCreated":
            useCreated(option.lifeCycle[life]!);
            break;
          case "onMounted":
            useMounted(option.lifeCycle[life]!);
            break;
          case "onUnMounted":
            useUnMounted(option.lifeCycle[life]!);
            break;
        }
      }
    }

    if (option.services) {
      const rawServices = Raw(option.services);
      for (let i in rawServices) {
        const service = rawServices[i];
        const ins = useService(service);
        services[i] = ins;
      }
    }

    for (let i in option.methods) {
      ctx[i] = option.methods[i].bind(ctx);
    }

    data.context = ctx;
  }
  return data.context;
}
