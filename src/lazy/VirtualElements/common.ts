import VirtualElement, {
  ElementResultType,
  FormattedElementResultType,
} from ".";
import {
  lazyDocument,
  ITextElement,
  IDomElement,
  Raw,
  flattern,
  IDomPosition,
} from "..";

export function formatResult(
  result: ElementResultType | FormattedElementResultType
): FormattedElementResultType {
  if (Array.isArray(result) && result.length > 0) {
    return result.map((i: any) => formatResult(i));
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
  _result: FormattedElementResultType,
  position: IDomPosition
) {
  const result = Raw(_result);
  if (Array.isArray(result)) {
    result.forEach((i) => renderResult(i, position));
  } else if (result instanceof VirtualElement) {
    return result.exec(position);
  }
  lazyDocument.insertElements([result as ITextElement], position);
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
