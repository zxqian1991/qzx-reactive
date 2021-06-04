import { Component, isComponent } from "./Component";
import { ITextElement, PropType, IDomPosition } from "./common";

import { FunctionalProp, FunctionalValue, IDomElement } from "./common";
import { lazyDocument } from "./Document";
import { Lazyable, onLazyable, Raw, transformLazyable } from "./Lazyable";
import { flattern } from "./utils";
import { LazyTask, runExcludeTask, getRunningTask } from "./LazyTask";
import { LazyProp } from "./LazyProp";

let FunctionalComponentIndex = 0;
let TempRunningFunctionalComponent = 0;
const FunctionalComponentStoreMap = new Map<
  number,
  {
    lazyableData: Record<string, any>[]; // 初始化的数据
    inited: boolean; // 是否已经初始化
    lazyableDataIndex: number; // 当前index
    onUnmount: null | (() => void);
    unmount: (() => void)[]; // 卸载的时候的回调
    mounted: (() => void)[]; // 组件已装载
  }
>();

export type ElementResultType =
  | VirtualElement
  | string
  | number
  | undefined
  | null
  | FunctionalValue
  | Array<ElementResultType>;

export type FormattedElementResultType =
  | VirtualElement
  | ITextElement
  | Array<FormattedElementResultType>;

export type ComponentType =
  | typeof Component
  | FunctionalComponent<any>
  | string
  | "fragment";
export type FunctionalComponent<P extends PropType> = (
  p?: P
) => ElementResultType;
export default class VirtualElement {
  private result?: FormattedElementResultType;
  private mainTask?: LazyTask<IDomElement[]>;
  isComponent = false;
  isFunction = false;
  isFragment = false;
  isNative = false;
  native?: IDomElement;
  Prop?: LazyProp;
  instance?: Component<PropType>;

  getKey() {
    return runExcludeTask(() => {
      return this.key?.();
    });
  }
  constructor(
    public id: number | string,
    public key: FunctionalValue | undefined,
    public component: ComponentType,
    public props: FunctionalProp[],
    public children: FunctionalValue[]
  ) {}
  private execComponent(): IDomElement[] {
    this.mainTask = new LazyTask<IDomElement[]>(
      (o1) => {
        // instance 要在prop之前 因为prop中要处理ref
        const unmount: (() => void)[] = [];
        o1.except(() => {
          this.instance = new (this.component as typeof Component)();
          this.Prop = new LazyProp(this);
          (this.instance as any)._prop = this.Prop.getProp();
          const r = this.instance.onCreated?.();
          if (r && typeof r === "function") {
            unmount.push(r);
          }
        });
        o1.addSubTask(
          new LazyTask((o2) => {
            const result = this.instance?.render();
            // 第一次运行 直接赋值
            if (o2.runTime === 1) {
              // 对结果做渲染
              const fr = runExcludeTask(() => {
                const fr = formatResult(result);
                o1.setData(renderResult(fr));
                return fr;
              });
              // 渲染完成后调用mounted函数
              const r = this.instance?.onMounted();
              if (r && typeof r === "function") {
                unmount.push(r);
              }
              this.result = fr;
            } else {
              // 非第一次，要比较 并返回最新结果
              diffResult(o2.id, formatResult(result), this.result!).then(
                ({ result: Res, elements }) => {
                  this.result = Res;
                  if (elements && elements.length > 0) {
                    o1.setData(elements);
                  }
                }
              );
            }
          })
        );
        return () => {
          // 停止属性的监听
          this.Prop?.stop();
          // 停止渲染任务
          unmount.forEach((r) => r());
          this.instance?.onUnMounted();
        };
      },
      { maxRunTime: 1 }
    );
    return this.mainTask.getData() || [];
  }
  private execFunctional(): IDomElement[] {
    this.mainTask = new LazyTask<IDomElement[]>(
      (o1) => {
        o1.except(() => (this.Prop = new LazyProp(this)));
        // 设置当前函数组件的一个唯一ID
        const ThisFunctionalIndex = ++FunctionalComponentIndex;
        const prop = this.Prop?.getProp();
        o1.addSubTask(
          new LazyTask((o2) => {
            // 执行函数 支持hooks基础功能
            const result = execFunctionalComponent(ThisFunctionalIndex, () =>
              (this.component as FunctionalComponent<PropType>)(prop)
            );
            if (o2.runTime === 1) {
              // 渲染结果
              const fr = runExcludeTask(() => {
                const fr = formatResult(result);
                o1.setData(renderResult(fr));
                return fr;
              });
              this.result = fr;
              // 获取数据
              const data = FunctionalComponentStoreMap.get(ThisFunctionalIndex);
              // 调用初始化数据
              if (data) {
                data.mounted.forEach((u) => u());
              }
            } else {
              diffResult(o2.id, formatResult(result), this.result!).then(
                ({ result: Res, elements }) => {
                  this.result = Res;
                  if (elements && elements.length > 0) {
                    o1.setData(elements);
                  }
                }
              );
            }
            return () => {
              const data = FunctionalComponentStoreMap.get(ThisFunctionalIndex);
              data?.unmount.forEach((u) => u());
              data?.onUnmount?.();
              FunctionalComponentStoreMap.delete(ThisFunctionalIndex);
            };
          })
        );
        return () => {
          this.Prop?.stop();
        };
      },
      {
        maxRunTime: 1,
      }
    );
    return this.mainTask.getData() || [];
  }
  private execFragment(): IDomElement[] {
    this.mainTask = new LazyTask<IDomElement[]>(
      (o1) => {
        // 这是被处理过的fragment

        this.Prop = o1.except(() => {
          return new LazyProp(this);
        });
        const prop = this.Prop.getProp();
        o1.addSubTask(
          new LazyTask((o2) => {
            if (typeof this.id === "string") {
              const children = prop.children || [];
              if (children.length <= 0)
                throw new Error("formatted fragment can not be Empty");
              const h = children[0] as FunctionalValue;
              const res = h();
              const fr = runExcludeTask(() => {
                return formatResult(res);
              });
              if (o2.runTime === 1) {
                runExcludeTask(() => {
                  o1.setData(renderResult(fr));
                });
                this.result = fr;
              } else {
                diffResult(o2.id, fr, this.result!).then(
                  ({ result: Res, elements }) => {
                    this.result = Res;
                    if (elements && elements.length > 0) {
                      o1.setData(elements);
                    }
                  }
                );
              }
            } else {
              if (o2.runTime === 1) {
                const children = prop.children as VirtualElement[];
                o1.setData(flattern(children.map((i) => renderResult(i))));
                this.result = children;
              } else {
                diffResult(
                  o2.id,
                  prop.children as VirtualElement[],
                  this.result!
                ).then(({ result }) => {
                  this.result = result;
                });
              }
            }
          })
        );
      },
      {
        maxRunTime: 1,
      }
    );
    return this.mainTask.getData() || [];
  }
  private execNative(): IDomElement[] {
    this.mainTask = new LazyTask<IDomElement[]>(
      (o1) => {
        const component = this.component as string;
        this.native = lazyDocument.createElement(component);
        this.Prop = o1.except(() => new LazyProp(this));
        o1.setData([this.native!]);
        const prop = this.Prop.getProp();
        const rawProp = Raw(prop);
        const handle = (p: string, cb: (t: LazyTask) => void) => {
          if (p === "children") {
            // children的需要特殊处理
            return new LazyTask<VirtualElement[]>((o3) => {
              if (rawProp.hasOwnProperty(p)) {
                if (o3.runTime === 1) {
                  // 第一次运行 执行结果
                  const elemets = flattern(
                    prop.children?.map((i) =>
                      renderResult(i as VirtualElement)
                    )!,
                    1
                  );
                  this.result = Raw(prop.children as VirtualElement[]);
                  // 将结果添加到dom中
                  this.native?.append(elemets);
                  // 存储下旧的值
                } else {
                  diffResult(
                    o3.id,
                    prop.children! as VirtualElement[],
                    this.result!
                  ).then(({ result }) => {
                    this.result = Raw(result);
                  });

                  // o3.setData(diffResult(prop.children, o3.getData()).result);
                }
              } else {
                // children没了  要卸载掉
                unmountResult(this.result || []);
                this.result = undefined;
                cb(o3.getTask());
              }
            });
          } else {
            // 正常的属性
            return new LazyTask((o3) => {
              // 对于children要做特殊心理
              if (rawProp.hasOwnProperty(p)) {
                const newV = prop[p];
                const oldV = o3.getData();
                if (newV !== oldV) {
                  this.native?.removeAttribute(p, oldV);
                  o3.setData(newV);
                  // 设置属性
                  this.native?.setAttribute(p, prop[p]);
                }
              } else {
                // 移除属性
                cb(o3.getTask());
              }
              return (isStop) =>
                isStop && this.native?.removeAttribute(p, o3.getData());
            });
          }
        };
        o1.addSubTask(
          new LazyTask((o2) => {
            // 处理所有的属性 同时要注意新增属性的情况
            const unsub = onLazyable("add", prop, (t, k) => {
              o2.addSubTask(
                handle(k as string, (t) => o2.removeSubTask(t, true))
              );
            });
            for (let i in prop) {
              o2.addSubTask(handle(i, (t) => o2.removeSubTask(t, true)));
            }
            return () => {
              // 停止所有的任务
              unsub();
            };
          })
        );
        return () => {
          this.Prop?.stop();
        };
      },
      {
        maxRunTime: 1,
      }
    );
    return this.mainTask.getData() || [];
  }
  stop() {
    this.mainTask?.stop();
    this.mainTask = undefined;
  }
  exec(): IDomElement[] {
    if (isComponent(this.component)) {
      this.isComponent = true;
      return this.execComponent();
    } else if (typeof this.component === "function") {
      this.isFunction = true;
      return this.execFunctional();
    } else if (this.component === "fragment") {
      this.isFragment = true;
      return this.execFragment();
    } else if (typeof this.component === "string") {
      this.isNative = true;
      return this.execNative();
    }
    return [];
  }
  getElements(): IDomElement[] {
    if (this.isNative) return [this.native!];
    return getElements(formatResult(this.result));
  }
  unmount(): IDomPosition | undefined {
    if (this.isNative) {
      this.result && unmountResult(this.result);
      this.stop();
      const position = lazyDocument.getPosition([this.native!]);
      this.native?.remove();
      return position;
    } else {
      const position = this.result && unmountResult(this.result);
      // 先结束子节点
      this.stop();
      return position;
    }
  }
}

/**
 * 格式化返回结果
 * @param result
 * @returns
 */
export const FORMATTED_ARRAY = Symbol("FORMATTED_ARRAY");

export function isFormattedArray(arr: any) {
  return arr && arr[FORMATTED_ARRAY];
}
export function formatResult(
  result: ElementResultType | FormattedElementResultType
): FormattedElementResultType {
  if (Array.isArray(result) && result.length > 0) {
    return new Proxy(result, {
      get(t, k, r) {
        if (k === FORMATTED_ARRAY) return true;
        return Reflect.get(t, k, r);
      },
    }).map((i: any) => formatResult(i));
  } else if (lazyDocument.isTextElement(result)) {
    return result as ITextElement;
  } else if (result instanceof VirtualElement) {
    return result;
  } else if (typeof result === "function") {
    return formatResult(result());
  }
  return lazyDocument.createTextElement(
    typeof result === "object" ? JSON.stringify(result) : (result as any)
  );
}

/**
 * 对于返回的结果进行解析
 * @param result
 * @returns
 */
export function renderResult(
  _result: FormattedElementResultType
): IDomElement[] {
  const result = Raw(_result);
  if (Array.isArray(result)) {
    return flattern(
      result.map((i) => renderResult(i)),
      1
    );
  } else if (result instanceof VirtualElement) {
    return result.exec();
  }
  return [result];
}

/**
 * 获取格式化后的节点数据
 * @param result
 * @param exec
 * @returns
 */
export function getElements(result: FormattedElementResultType): IDomElement[] {
  if (Array.isArray(result)) {
    return flattern(
      result.map((i) => getElements(i)),
      -1
    );
  } else if (result instanceof VirtualElement) {
    if (result.isNative) return [result.native!];
    return result.getElements();
  }
  return [result as ITextElement];
}

export function unmountResult(
  result: FormattedElementResultType
): IDomPosition | undefined {
  if (Array.isArray(result)) {
    const positions = result.map((r) => unmountResult(r));
    return positions[positions.length - 1];
  } else if (result instanceof VirtualElement) {
    return result.unmount();
  } else {
    const position = lazyDocument.getPosition([result]);
    result.remove();
    return position;
  }
}

/**
 * 执行函数组件时所作的操作
 * execFunctionalComponent(1, () => SomeCom(prop))
 * @param func
 */
function execFunctionalComponent<P extends PropType>(
  index: number,
  func: () => ElementResultType
) {
  // 初始化函数组件的数据
  const lastRunningComponent = TempRunningFunctionalComponent;
  TempRunningFunctionalComponent = index;
  if (!FunctionalComponentStoreMap.has(TempRunningFunctionalComponent)) {
    FunctionalComponentStoreMap.set(TempRunningFunctionalComponent, {
      lazyableData: [],
      inited: false,
      lazyableDataIndex: 0,
      unmount: [],
      mounted: [],
      onUnmount: null,
    });
  }
  // 执行
  const result = func();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    data.inited = true;
  }
  data.lazyableDataIndex = 0; // 重置下标
  TempRunningFunctionalComponent = lastRunningComponent;
  return result;
}

function assertInFunctionComponent() {
  if (!TempRunningFunctionalComponent)
    throw new Error("useLazyable only support functional component!");
}

// 使用响应值
export function useLazyable<T extends Record<string, any>>(initialValue: T): T {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  let returnValue: T;
  if (data.inited) {
    returnValue = data.lazyableData[data.lazyableDataIndex] as T;
    data.lazyableDataIndex++;
  } else {
    returnValue = Lazyable(initialValue);
    data.lazyableData.push(returnValue);
  }
  return returnValue!;
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
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    data.onUnmount = func;
  }
}

export function useMounted(func: () => void | (() => void)) {
  assertInFunctionComponent();
  const data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent)!;
  if (!data.inited) {
    data.mounted.push(() => {
      const res = func();
      if (res && typeof res === "function") data.unmount.push(res);
    });
  }
}

/**
 * @todo
 * @param newResult
 * @param oldResult
 * @returns
 */
const runnningDiffTasks = new Map<number, LazyTask>();
export async function diffResult(
  id: number,
  newResult: FormattedElementResultType,
  oldResult: FormattedElementResultType
): Promise<{ result: FormattedElementResultType; elements?: IDomElement[] }> {
  if (runnningDiffTasks.has(id)) {
    runnningDiffTasks.get(id)?.stop();
  }
  console.log("diff", newResult, oldResult);
  return new Promise((resolve, reject) => {
    const mainTask = new LazyTask(() => {});
    runnningDiffTasks.set(id, mainTask);
    mainTask.addSubTask(
      new LazyTask<{
        result: FormattedElementResultType;
        elements?: IDomElement[];
      }>((o) => {
        let canRun = true;
        o.except(async () => {
          // 都是虚拟DOM 看类型是否一样
          if (
            newResult instanceof VirtualElement &&
            oldResult instanceof VirtualElement &&
            newResult.component === oldResult.component &&
            newResult.id === oldResult.id
          ) {
            oldResult.Prop?.update(
              newResult.id,
              newResult.props,
              newResult.children
            );
            return { result: oldResult };
          } else if (Array.isArray(newResult) && Array.isArray(oldResult)) {
            const oldKeymap = new Map<any, Map<any, number>>();
            const oldRestIndexes = new Set<number>();
            const usedOldIndex = new Set<number>();
            oldResult.forEach((r, index) => {
              if (r instanceof VirtualElement) {
                const key = r.getKey();
                if (
                  !oldKeymap.has(r.component) ||
                  !oldKeymap.get(r.component)?.has(key)
                ) {
                  if (!oldKeymap.has(r.component)) {
                    oldKeymap.set(r.component, new Map());
                  }
                  if (!oldKeymap.get(r.component)?.has(key)) {
                    oldKeymap.get(r.component)?.set(key, index);
                  }
                  return;
                }
              }
              oldRestIndexes.add(index);
            });
            // 先获取第一个元素
            let positionIndex = 0;
            let elements = getElements(oldResult[positionIndex]);
            let nextElement: IDomElement | null = elements[0];
            let parent = nextElement?.parent;
            const newReturnResult: FormattedElementResultType = [];
            const returnElements: (IDomElement | IDomElement[])[] = [];
            for (let i = 0; i < newResult.length; i++) {
              const r = newResult[i];
              if (r instanceof VirtualElement) {
                const key = r.getKey();
                // 存在key 之所以单独把key在这里 是为了使用key变量 避免不必要的函数计算
                if (key !== undefined && key !== null) {
                  const component = r.component;
                  // component 和 key都必须相同 否则就是替换
                  if (
                    oldKeymap.has(component) &&
                    oldKeymap.get(component)?.has(key)
                  ) {
                    // 在旧的结果中存在这个值
                    const oldPosition = oldKeymap.get(component)?.get(key)!;
                    // 删除 防止之后又重复的key
                    const keys = oldKeymap.get(component);
                    keys?.delete(key);
                    if (keys?.size === 0) {
                      oldKeymap.delete(component);
                    }
                    usedOldIndex.add(oldPosition);
                    const or = oldResult[oldPosition] as VirtualElement;
                    if (or.id === r.id) {
                      or.Prop?.update(r.id, r.props, r.children);
                      newReturnResult.push(or);
                      const newElements = or.getElements();
                      returnElements.push(newElements);
                      // 老结果的位置就是当前nextElement所在的那个index的位置  那就更新老结果
                      if (oldPosition === positionIndex) {
                        while (positionIndex < oldResult.length) {
                          positionIndex++;
                          if (positionIndex >= oldResult.length) {
                            nextElement =
                              elements[elements.length - 1].nextSibling;
                            parent = nextElement?.parent || parent;
                          } else if (!usedOldIndex.has(positionIndex)) {
                            // 这个位置的元素可能已经被用过了 要忽略
                            // 如果这个位置没被用过 那就要用起来
                            elements = getElements(oldResult[positionIndex]);
                            nextElement = elements[0];
                            parent = nextElement.parent || parent;
                            // 跳出循环
                            break;
                          }
                        }
                      } else {
                        // 在老结果中有对应的元素   不管在哪里 他肯定要移到nextElement前面
                        // newElements.forEach((r) => r.remove());
                        lazyDocument.insertElements(newElements, {
                          parent,
                          nextSibling: nextElement,
                          preSibling: nextElement?.preSibling || null,
                        });
                      }
                      continue;
                    }
                  }
                }
              }
              // 渲染结果  获得DOM
              const tempElements = renderResult(r);
              // 保存结果
              returnElements.push(tempElements);
              // 插入DOM
              parent?.insertBefore(tempElements, nextElement);
              // 存储结果
              newReturnResult.push(r);
              await lazyDocument.canRunning();
              // 不能运行了 跳出逊汗
              if (!canRun) break;
            }
            // 不能运行了 就啥都不做了  向下
            if (!canRun) {
              return false;
            }
            // 别忘了把没用到的数据给删了
            oldRestIndexes.forEach((i) => unmountResult(oldResult[i]));
            oldKeymap.forEach((map) =>
              map.forEach((i) => unmountResult(oldResult[i]))
            );
            return {
              result: newReturnResult,
              elements: flattern(returnElements),
            };
            /**
             * 数组DIFF操作的逻辑
             * 1. component + key相同才能算同一种类型
             * 2. 其他的都不算 该删的删
             */
          } else if (
            lazyDocument.isTextElement(newResult) &&
            lazyDocument.isTextElement(oldResult)
          ) {
            const newText = (newResult as IDomElement).getText();
            const oldText = (oldResult as IDomElement).getText();
            if (newText !== oldText) {
              (oldResult as ITextElement).setText(newText);
            }
            return { result: oldResult };
          }
          const position = unmountResult(oldResult);
          if (!position) throw new Error("Old Virtual Element is Error!");
          const doms = renderResult(newResult);
          lazyDocument.insertElements(doms, position);
          return { result: newResult, elements: doms };
        }).then((data) => {
          runnningDiffTasks.delete(id);
          mainTask.stop();
          if (data) {
            resolve(data);
          } else {
            reject();
          }
        });
        return () => {
          canRun = false;
        };
      })
    );
  });
}
