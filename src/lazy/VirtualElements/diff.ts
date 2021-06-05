import VirtualElement, { FormattedElementResultType } from ".";
import {
  LazyTask,
  IDomElement,
  lazyDocument,
  flattern,
  ITextElement,
} from "..";
import { getElements, renderResult, unmountResult } from "./common";

/**
 * @todo
 * @param newResult
 * @param oldResult
 * @returns
 */
const runnningDiffTasks = new Map<number, LazyTask>();
export default async function diffResult(
  id: number,
  newResult: FormattedElementResultType,
  oldResult: FormattedElementResultType
): Promise<{ result: FormattedElementResultType; elements?: IDomElement[] }> {
  if (runnningDiffTasks.has(id)) {
    runnningDiffTasks.get(id)?.stop();
  }
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