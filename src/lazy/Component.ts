import { PropType } from "./types";
import { ElementResultType } from "./VirtualElements";

export const COMPONENT_FLAG = Symbol("COMPONENT_FLAG");

export class Component<P extends PropType = {}> {
  private $$_$$_$$_prop?: P;

  private $$_$$_$$_nextticks: (() => void)[] = [];

  get props(): P & PropType {
    return this.$$_$$_$$_prop! || {};
  }
  onMounted(): void | (() => void) {}
  onCreated(): void | (() => void) {}
  onUnMounted() {}
  nextTick(handler: () => {}) {
    this.$$_$$_$$_nextticks.push(handler);
  }
  render(): ElementResultType {
    return undefined;
  }
  constructor() {}
}

(Component.prototype as any)[COMPONENT_FLAG] = true;

export function isComponent(t: any): boolean {
  return t && typeof t === "function" && t.prototype[COMPONENT_FLAG];
}
