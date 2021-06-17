import { LazyTask, runExcludeTask, lazyDocument } from "..";
import { LazyProp } from "../LazyProp";
import FragmentRender from "./Render/FragmentRender";
import FunctionalRender from "./Render/FunctionalRender";
import NativeRender from "./Render/NativeRender";
import { getElements, formatResult, unmountResult } from "./common";

export default class VirtualElement implements X.VirtualElement {
  result?: X.FormattedElementResultType;
  private mainTask?: LazyTask<X.IDomElement[]>;
  isFunction = false;
  isFragment = false;
  isNative = false;
  native?: X.IDomElement;
  Prop?: LazyProp;

  level = 0;

  position?: X.IDomPosition;

  ctx!: Partial<X.IFunctionalContext>;

  injectChild?: X.IInjectChild;

  getKey() {
    return runExcludeTask(() => {
      return this.key?.();
    });
  }
  constructor(
    public id: number | string,
    public key: X.FunctionalValue | undefined,
    public component: X.ComponentType,
    public props: X.FunctionalProp[],
    public children: X.FunctionalValue[]
  ) {}
  private execFunctional() {
    this.mainTask = FunctionalRender(this);
    return this.mainTask.getData() || [];
  }
  private execFragment() {
    this.mainTask = FragmentRender(this);
    return this.mainTask.getData() || [];
  }
  private execNative() {
    this.mainTask = NativeRender(this);
    return this.mainTask.getData() || [];
  }
  stop() {
    this.mainTask?.stop();
    this.mainTask = undefined!;
  }
  exec(
    position: X.IDomPosition,
    parentLevel: number,
    ctx: Partial<X.IFunctionalContext>
  ) {
    this.position = position;
    this.ctx = ctx;
    if (typeof this.component === "function") {
      this.level = parentLevel + 1;
      this.isFunction = true;
      return this.execFunctional();
    } else if (this.component === "fragment") {
      // fragment维持不变
      this.level = parentLevel;
      this.isFragment = true;
      return this.execFragment();
    } else if (typeof this.component === "string") {
      this.level = parentLevel + 1;
      this.isNative = true;
      return this.execNative();
    }
    return [];
  }
  getElements(): X.IDomElement[] {
    if (this.isNative) return [this.native!];
    return getElements(formatResult(this.result));
  }
  unmount(): X.IDomPosition | undefined {
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
