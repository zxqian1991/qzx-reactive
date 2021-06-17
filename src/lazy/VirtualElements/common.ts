import VirtualElement from ".";
import { lazyDocument, Raw, flattern } from "..";

export function formatResult(
  result: X.ElementResultType | X.FormattedElementResultType
): X.FormattedElementResultType {
  if (Array.isArray(result) && result.length > 0) {
    return result.map((i: any) => formatResult(i));
  } else if (lazyDocument.isTextElement(result)) {
    return result as X.ITextElement;
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
  _result: X.FormattedElementResultType,
  position: X.IDomPosition,
  level = 0,
  ctx: Partial<X.IFunctionalContext>
) {
  const result = Raw(_result);
  if (Array.isArray(result)) {
    result.forEach((i) => renderResult(i, position, level, ctx));
    return;
  } else if (result instanceof VirtualElement) {
    result.exec(position, level, ctx);
  }
  lazyDocument.insertElements([result as X.ITextElement], position);
}

/**
 * 获取格式化后的节点数据
 * @param result
 * @param exec
 * @returns
 */
export function getElements(
  result: X.FormattedElementResultType
): X.IDomElement[] {
  if (Array.isArray(result)) {
    return flattern(
      result.map((i) => getElements(i)),
      -1
    );
  } else if (result instanceof VirtualElement) {
    if (result.isNative) return [result.native!];
    return result.getElements();
  }
  return [result as X.ITextElement];
}

export function unmountResult(
  result: X.FormattedElementResultType
): X.IDomPosition | undefined {
  if (Array.isArray(result)) {
    const positions = result.map((r) => unmountResult(r));
    return positions[positions.length - 1];
  } else if (result instanceof VirtualElement) {
    return result.unmount();
  } else {
    const position = lazyDocument.getPosition([result as X.IDomElement]);
    (result as X.IDomElement).remove();
    return position;
  }
}

export function injectChild(child: VirtualElement, inject: X.IInjectChild) {
  const children = child.children;
  child.children = children.map((child) => () => {
    const res = child();
    if (res instanceof VirtualElement) {
      if (res.isFragment) {
        injectChild(res, inject);
      } else {
        res.injectChild = inject;
      }
      return res;
    } else if (Array.isArray(res)) {
      const data = flattern(res);
      data.forEach((i) => {
        if (i instanceof VirtualElement) {
          injectChild(i, inject);
        }
      });
      return data;
    }
    return res;
  });
}
