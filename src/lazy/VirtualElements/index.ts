import {
  FunctionalValue,
  ITextElement,
  Component,
  PropType,
  LazyTask,
  IDomElement,
  runExcludeTask,
  FunctionalProp,
  lazyDocument,
  isComponent,
  IDomPosition,
} from "..";
import { LazyProp } from "../LazyProp";
import FragmentRender from "./Render/FragmentRender";
import FunctionalRender, {
  FunctionalComponent,
} from "./Render/FunctionalRender";
import NativeRender from "./Render/NativeRender";
import ComponentRender from "./Render/ComponentRender";
import { getElements, formatResult, unmountResult } from "./common";

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

export default class VirtualElement {
  result?: FormattedElementResultType;
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
    this.mainTask = ComponentRender(this);
    return this.mainTask.getData() || [];
  }
  private execFunctional(): IDomElement[] {
    this.mainTask = FunctionalRender(this);
    return this.mainTask.getData() || [];
  }
  private execFragment(): IDomElement[] {
    this.mainTask = FragmentRender(this);
    return this.mainTask.getData() || [];
  }
  private execNative(): IDomElement[] {
    this.mainTask = NativeRender(this);
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