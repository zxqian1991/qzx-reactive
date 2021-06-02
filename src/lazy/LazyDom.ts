import { IDocument, IDomElement } from "./common";
import { joinObject } from "./utils/Object";
import { getRunningTask, LazyTask } from "./LazyTask";

class MyBaseElement implements IDomElement {
  isText() {
    return this.dom instanceof Text;
  }
  getText() {
    return this.isText()
      ? (this.dom as Text).textContent
      : (this.dom as any)?.innerText;
  }
  constructor(private dom: Text | HTMLElement) {}
  append(eles: IDomElement[]) {
    eles.forEach((ele) => {
      // 得保证都是 MyBaseElement类型 Ts的优势出来了
      if (ele instanceof MyBaseElement) {
        this.dom.appendChild(ele.dom);
      }
    });
  }
  get nextSibling(): IDomElement | null {
    const sib = this.dom.nextSibling || this.dom.nextElementSibling;
    if (!sib) return null;
    return new MyBaseElement(sib as any);
  }
  get preSibling(): IDomElement | null {
    const sib = this.dom.previousSibling || this.dom.previousElementSibling;
    if (!sib) return null;
    return new MyBaseElement(sib as any);
  }
  get parent(): IDomElement | null {
    const parent = this.dom.parentElement || this.dom.parentNode;
    if (!parent) return null;
    return new MyBaseElement(parent as any);
  }
  insertBefore(doms: IDomElement[], target: IDomElement | null) {
    if (target) {
      if (!(target instanceof MyBaseElement))
        throw new Error("target to insert must be MyBaseElement Type");
      doms.forEach((dom) => {
        if (dom instanceof MyBaseElement) {
          this.dom.insertBefore(dom.dom, target.dom);
        }
      });
    } else {
      doms.forEach((dom) => {
        if (dom instanceof MyBaseElement) {
          this.dom.appendChild(dom.dom);
        }
      });
    }
  }
  setAttribute(attr: string, value: any) {
    if (attr === "key") return;
    if ((this.dom as any)?.setAttribute) {
      // 处理事件
      if (/^on\w+/gi.test(attr)) {
        const eventname = attr.toLowerCase().replace(/^on/gi, "");
        this.dom.addEventListener(eventname, value);
        return;
      }
      switch (attr) {
        case "className":
          const tv = classNames(value);
          if (tv) {
            (this.dom as HTMLElement).setAttribute("class", tv);
          }
          break;
        case "style":
          const s = style(value);
          if (s) {
            (this.dom as HTMLElement).setAttribute("style", s);
          }
          break;
        default:
          (this.dom as HTMLElement).setAttribute(attr, value);
      }
    }
  }
  removeAttribute(attr: string, value?: any) {
    if (/^on\w+/gi.test(attr)) {
      const eventname = attr.toLowerCase().replace(/^on/gi, "");
      this.dom.removeEventListener(eventname, value);
      return;
    }
    if ((this.dom as any)?.removeAttribute) {
      switch (attr) {
        case "className":
          (this.dom as HTMLElement).removeAttribute("class");
          break;
        default:
          (this.dom as HTMLElement).removeAttribute(attr);
      }
    }
  }
  remove() {
    return this.dom.remove();
  }
  // 清空子节点
  clear() {
    if (this.dom instanceof Text) {
      this.dom.textContent = "";
    } else {
      this.dom.innerHTML = "";
    }
  }
}

const HTMLDOMDrive: IDocument = {
  createTextElement(v: string) {
    return new MyBaseElement(new Text(v));
  },
  isTextElement(v: any) {
    return v instanceof MyBaseElement && v.isText();
  },
  createElement(dom: string) {
    return new MyBaseElement(document.createElement(dom));
  },
  querySelector(v: string) {
    const r = document.querySelector(v);
    if (r) return new MyBaseElement(r as any);
    return null;
  },
  querySelectorAll(v: string) {
    const rs = document.querySelectorAll(v);
    if (rs) return Array.from(rs).map((r) => new MyBaseElement(r as any));
    return null;
  },
};

export default HTMLDOMDrive;

type TypeOfClassNames =
  | string
  | undefined
  | (string | undefined | { [prop: string]: boolean })[]
  | { [prop: string]: boolean };
function className(classname: TypeOfClassNames): string | undefined {
  if (!classname) return;
  if (typeof classname === "string") {
    return classname;
  }
  if (Array.isArray(classname)) {
    return classname
      .map(className)
      .filter((c) => c)
      .join(" ");
  }
  return className(
    Object.keys(classname)
      .filter((prop) => classname[prop])
      .map((prop) => prop)
  );
}
function classNames(...classnames: TypeOfClassNames[]): string | undefined {
  return className(classnames.map(className));
}

/**
 * 对style的处理 这里是简单的、初级的
 * @param value
 * @returns
 */
function style(value: string | Record<string, any>) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") return joinObject(value, "&").trim();
  return undefined;
}
