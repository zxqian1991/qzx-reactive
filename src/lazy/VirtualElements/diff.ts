import VirtualElement from ".";
import { lazyDocument } from "..";
import { getElements, renderResult, unmountResult } from "./common";

type FormattedElementResultType = X.FormattedElementResultType;

export default function diffResult(
  id: number | string, // 保留 方便以后做异步中断
  newResult: FormattedElementResultType,
  oldResult: FormattedElementResultType,
  level: number,
  ctx: Partial<X.IFunctionalContext>
) {
  // 都是虚拟DOM 看类型是否一样
  if (
    newResult instanceof VirtualElement &&
    oldResult instanceof VirtualElement &&
    newResult.component === oldResult.component &&
    newResult.id === oldResult.id
  ) {
    // oldResult.Prop?.update(newResult.id, newResult.props, newResult.children);
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
    let nextElement: X.IDomElement | null = elements[0];
    let parent = nextElement?.parent;
    const newReturnResult: FormattedElementResultType = [];
    for (let i = 0; i < newResult.length; i++) {
      const r = newResult[i];
      if (r instanceof VirtualElement) {
        const key = r.getKey();
        // 存在key 之所以单独把key在这里 是为了使用key变量 避免不必要的函数计算
        if (key !== undefined && key !== null) {
          const component = r.component;
          // component 和 key都必须相同 否则就是替换
          if (oldKeymap.has(component) && oldKeymap.get(component)?.has(key)) {
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
              // or.Prop?.update(r.id, r.props, r.children);
              newReturnResult.push(or);
              // 就在前面 不用移动
              if (positionIndex - oldPosition === 1) continue;
              // 要移动的元素在后面 把positionIndex指向更后面~~
              const isOldPositionAfterPositionIndexOneStep =
                oldPosition - positionIndex === 1;
              if (isOldPositionAfterPositionIndexOneStep)
                positionIndex = oldPosition; // 指向当前元素
              // 位置不同 把元素插进来
              if (oldPosition !== positionIndex) {
                const newElements = or.getElements();
                lazyDocument.insertElements(newElements, {
                  parent: parent!,
                  nextSibling: nextElement,
                  preSibling: nextElement?.preSibling || null,
                });
              }
              // positionIndex向后移动一位
              while (positionIndex < oldResult.length) {
                positionIndex++;
                if (positionIndex >= oldResult.length) {
                  nextElement = elements[elements.length - 1].nextSibling;
                  parent = nextElement?.parent || parent;
                } else if (!usedOldIndex.has(positionIndex)) {
                  // 这个位置的元素可能已经被用过了 要忽略
                  // 如果这个位置没被用过 那就要用起来
                  elements = getElements(oldResult[positionIndex]);
                  nextElement = elements[0];
                  parent = nextElement?.parent || parent;
                  // 跳出循环
                  break;
                }
              }
              continue;
            }
          }
        }
      }
      renderResult(
        r,
        { parent, nextSibling: nextElement, preSibling: null },
        level,
        ctx
      );
      // 存储结果
      newReturnResult.push(r);
    }
    // 别忘了把没用到的数据给删了
    oldRestIndexes.forEach((i) => unmountResult(oldResult[i]));
    oldKeymap.forEach((map) => map.forEach((i) => unmountResult(oldResult[i])));
    return {
      result: newReturnResult,
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
    const newText = (newResult as X.IDomElement).getText();
    const oldText = (oldResult as X.IDomElement).getText();
    if (newText !== oldText) {
      (oldResult as X.ITextElement).setText(newText);
    }
    return { result: oldResult };
  }
  const position = unmountResult(oldResult);
  if (!position) throw new Error("Old Virtual Element is Error!");
  renderResult(newResult, position, level, ctx);
  return { result: newResult };
}
