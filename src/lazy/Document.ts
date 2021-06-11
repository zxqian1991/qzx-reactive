import { IDocument, IDomElement, IDomPosition } from "./types";

let nextTicks: VoidFunction[] = [];
export class LazyDocument implements IDocument {
  isTextElement(d: any) {
    return undefined as any;
  }
  createTextElement(t: string) {
    return undefined as any;
  }
  createElement(t: string) {
    return undefined as any;
  }
  querySelector(k: string) {
    return null;
  }
  querySelectorAll() {
    return null;
  }
  getPosition(elements: IDomElement[]): IDomPosition {
    if (elements.length <= 0) throw new Error("no elements can use");
    const lastElement = elements[elements.length - 1];
    return {
      nextSibling: lastElement.nextSibling,
      parent: lastElement.parent,
      preSibling: lastElement.preSibling,
    };
  }
  insertElements(elements: IDomElement[], position: IDomPosition) {
    if (position.nextSibling) {
      position.parent?.insertBefore(elements, position.nextSibling);
    } else if (position.parent) {
      position.parent.append(elements);
    } else {
      throw new Error("position is invalid!");
    }
  }
  replaceElements(newElements: IDomElement[], oldElements: IDomElement[]) {
    const position = this.getPosition(oldElements);
    oldElements.forEach((ele) => ele.remove());
    this.insertElements(newElements, position);
  }
  async canRunning() {
    return true;
  }

  nextTick(h: VoidFunction) {
    nextTicks.push(h);
  }
  runNextTicks() {
    const next = nextTicks;
    nextTicks = [];
    next.forEach((n) => n());
  }

  onIdle(h: () => void): () => void {
    const me = this;
    let stop = false;
    function run(autoRun = true) {
      if (autoRun) {
        h();
      }
      if (!stop) {
        me.canRunning().then(run);
      }
    }
    run(false);
    return () => {
      stop = true;
    };
  }
}

const lazyDocument = new LazyDocument();
export { lazyDocument };
