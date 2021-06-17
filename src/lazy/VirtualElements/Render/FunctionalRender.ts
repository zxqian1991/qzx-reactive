import VirtualElement from "..";
import { LazyTask, runExcludeTask } from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { formatResult, renderResult, injectChild } from "../common";
import { Lazyable, Raw } from "../../Lazyable";
import { useService } from "../../LazyService";
import { cloneLazyableObject } from "../../LazyTask";

let FunctionalComponentIndex = 0;
let TempRunningFunctionalComponent = 0;
const FunctionalComponentStoreMap = new Map<number, X.FunctionComponentStore>();

export default function FunctionalRender(virtualElement: VirtualElement) {
  return new LazyTask(
    (o1) => {
      o1.except(() => (virtualElement.Prop = new LazyProp(virtualElement)));
      // 设置当前函数组件的一个唯一ID
      const virtualElementFunctionalIndex = ++FunctionalComponentIndex;
      const prop = virtualElement.Prop?.getProp();
      o1.except(() => {
        if (virtualElement.injectChild) {
          virtualElement.injectChild(virtualElement, prop);
        }
      });
      o1.addSubTask(
        new LazyTask((o2) => {
          // 执行函数 支持hooks基础功能
          const result = execFunctionalComponent(
            virtualElementFunctionalIndex,
            virtualElement,
            (data) =>
              (virtualElement.component as X.FunctionalComponent<X.PropType>)(
                prop,
                o2.runTime === 1 ? undefined : data.context
              )
          );
          const data = FunctionalComponentStoreMap.get(
            virtualElementFunctionalIndex
          )!;
          if (data.injectChildProp) {
            Raw(prop)?.children?.forEach((child) => {
              if (child instanceof VirtualElement) {
                injectChild(child, data.injectChildProp!);
              }
            });
          }
          if (o2.runTime === 1) {
            // 渲染结果
            const fr = runExcludeTask(() => {
              const fr = formatResult(result);

              renderResult(
                fr,
                virtualElement.position!,
                virtualElement.level,
                // 替换成自己的store
                data.context.store
              );
              return fr;
            });
            virtualElement.result = fr;
            // 调用初始化数据
            if (data) {
              data.mounted.forEach((u) => u());
            }
          } else {
            const { result: Res } = diffResult(
              o2.id,
              formatResult(result),
              virtualElement.result!,
              virtualElement.level - 1,
              virtualElement.ctx
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
function execFunctionalComponent<P extends X.PropType>(
  index: number,
  virtualElement: VirtualElement,
  func: (data: X.FunctionComponentStore) => X.ElementResultType
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
      virtualElement,
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

export function useCtx<
  T extends Record<string, any>,
  C extends Record<string, (...args: any[]) => any>,
  S extends Record<string, new (...args: any[]) => any>,
  M extends Record<string, (...args: any[]) => any>
>(
  option: X.FunctionalComponentConfig<T, C, S, M>
): X.FunctionContextType<T, C, S, M> {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    data.injectChildProp = option.injectChildProp!;
    const state = Lazyable(option.state || {});
    const services: X.ServiceType<S> = {} as any;
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
      store: cloneLazyableObject(data.virtualElement.ctx),
      setStore: function <K extends keyof X.IFunctionalContext>(
        key: K,
        v: X.IFunctionalContext[K]
      ) {
        this.store[key] = v;
      },
    };
    if (option.lifeCycle) {
      for (let life in option.lifeCycle) {
        switch (life) {
          case "onCreated":
            option.lifeCycle[life] &&
              useCreated(option.lifeCycle[life]!.bind(ctx!));
            break;
          case "onMounted":
            option.lifeCycle[life] &&
              useMounted(option.lifeCycle[life]!.bind(ctx));
            break;
          case "onUnMounted":
            option.lifeCycle[life] &&
              useUnMounted(option.lifeCycle[life]!.bind(ctx));
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
