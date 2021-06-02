import VirtualElement from "./VirtualElement";
export type FunctionalValue = () => any;

export interface ChildrenType {
  children?: (VirtualElement | FunctionalValue)[];
}

export interface PropType extends Record<string, any>, ChildrenType {}

export type FunctionalPropType = "rest" | "normal";
export type FunctionalProp = {
  type: FunctionalPropType;
  value: FunctionalValue;
  property?: string;
};
export interface IDomPosition {
  parent: IDomElement | null;
  nextSibling: IDomElement | null;
  preSibling: IDomElement | null;
}
export interface IDocument {
  isTextElement: (result: any) => boolean;
  createTextElement: (text: string) => ITextElement;
  createElement: (tag: string) => IDomElement;
  querySelector: (ele: string) => IDomElement | null;
  querySelectorAll: (ele: string) => IDomElement[] | null;
}

export interface IDomElement {
  append: (eles: IDomElement[]) => void;
  nextSibling: IDomElement | null;
  preSibling: IDomElement | null;
  parent: IDomElement | null;
  getText: () => string;
  insertBefore: (doms: IDomElement[], target: IDomElement | null) => void; // 在子元素dom前插入新的元素
  setAttribute: (attr: string, value: any) => void;
  removeAttribute: (attr: string, value?: any) => void;
  remove: () => void;
  clear: () => void;
}

export interface ITextElement extends IDomElement {}