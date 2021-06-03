import {
  ComponentType,
  ElementResultType,
  renderResult,
} from "./VirtualElement";
import {
  FunctionalProp,
  FunctionalValue,
  IDocument,
  IDomElement,
} from "./common";
import VirtualElement from "./VirtualElement";
import { formatResult } from "./VirtualElement";
import { lazyDocument } from "./Document";
import HTMLDOMDrive from "./LazyDom";
export * from "./utils";
export * from "./Document";
export * from "./common";
export * from "./Component";
export * from "./Lazyable";
export * from "./LazyTask";
export * from "./VirtualElement";

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
