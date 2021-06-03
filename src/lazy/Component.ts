import { PropType } from "./common";
import { ElementResultType } from "./VirtualElement";
import { Stateable } from "./Lazyable";
export const COMPONENT_FLAG = Symbol("COMPONENT_FLAG");

export class Component<P extends PropType = {}> {
  private _prop?: P;
  get props(): P & PropType {
    return this._prop! || {};
  }
  onMounted(): void | (() => void) {}
  onCreated(): void | (() => void) {}
  onUnMounted() {}
  render(): ElementResultType {
    return undefined;
  }
  constructor() {}
}

(Component.prototype as any)[COMPONENT_FLAG] = true;

export function isComponent(t: any): boolean {
  return t && typeof t === "function" && t.prototype[COMPONENT_FLAG];
}
