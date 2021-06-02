import { PropType } from "./common";
import { ElementResultType } from "./VirtualElement";
export const COMPONENT_FLAG = Symbol("COMPONENT_FLAG");
export class Component<P extends PropType> {
  static [COMPONENT_FLAG] = true;
  private _prop?: P;
  get props(): P {
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
