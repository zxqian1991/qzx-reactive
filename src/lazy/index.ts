import {
  FunctionalProp,
  FunctionalValue,
  IDocument,
  IDomElement,
} from "./types";
import { lazyDocument } from "./Document";
import HTMLDOMDrive from "./LazyDom";
import VirtualElement, {
  ComponentType,
  ElementResultType,
} from "./VirtualElements";
import { formatResult, renderResult } from "./VirtualElements/common";
export * from "./utils";
export * from "./Document";
export * from "./types";
export * from "./Component";
export * from "./Lazyable";
export * from "./LazyTask";

const Lazyman = {
  createElement(
    id: number,
    key: FunctionalValue,
    component: ComponentType,
    props: FunctionalProp[],
    children: FunctionalValue[]
  ) {
    return new VirtualElement(id, key, component, props, children);
  },
  document: lazyDocument,
  // 加载驱动
  drive(d: IDocument = HTMLDOMDrive) {
    Object.assign(lazyDocument, d);
  },
  render(ele: ElementResultType, container: IDomElement) {
    if (!container) throw new Error("container is Emptry");
    const format = formatResult(ele);
    container.append(renderResult(format));
  },
};

export default Lazyman;
(window as any).Lazyman = Lazyman;

export { Lazyman };
