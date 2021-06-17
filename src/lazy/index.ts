import { lazyDocument } from "./Document";
import HTMLDOMDrive from "./LazyDom";
import VirtualElement, {
  ComponentType,
  ElementResultType,
} from "./VirtualElements";
import {
  formatResult,
  renderResult,
  unmountResult,
} from "./VirtualElements/common";
export * from "./utils";
export * from "./Document";
export * from "./Lazyable";
export * from "./LazyTask";

const Lazyman = {
  createElement(
    id: number,
    key: X.FunctionalValue,
    component: ComponentType,
    props: X.FunctionalProp[],
    children: X.FunctionalValue[]
  ) {
    return new VirtualElement(id, key, component, props, children);
  },
  document: lazyDocument,
  // 加载驱动
  drive(d: X.IDocument = HTMLDOMDrive) {
    Object.assign(lazyDocument, d);
  },
  render(ele: ElementResultType, container: X.IDomElement) {
    if (!container) throw new Error("container is Emptry");
    const formatted = formatResult(ele);
    renderResult(
      formatted,
      {
        parent: container,
        nextSibling: null,
        preSibling: null,
      },
      0,
      {}
    );
    return {
      unmount() {
        unmountResult(formatted);
      },
    };
  },
};

export default Lazyman;
(window as any).Lazyman = Lazyman;

export { Lazyman };
