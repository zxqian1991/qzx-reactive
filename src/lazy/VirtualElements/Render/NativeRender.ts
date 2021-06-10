import VirtualElement from "..";
import {
  LazyTask,
  IDomElement,
  lazyDocument,
  Raw,
  flattern,
  onLazyable,
} from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { renderResult, unmountResult } from "../common";

export default function NativeRender(virtualElement: VirtualElement) {
  return new LazyTask(
    (o1) => {
      const component = virtualElement.component as string;
      virtualElement.native = lazyDocument.createElement(component);
      virtualElement.parent?.append(virtualElement.native!);
      virtualElement.Prop = o1.except(() => new LazyProp(virtualElement));
      const prop = virtualElement.Prop.getProp();
      const rawProp = Raw(prop);
      const handle = (p: string, cb: (t: LazyTask) => void) => {
        if (p === "children") {
          // children的需要特殊处理
          return new LazyTask<VirtualElement[]>((o3) => {
            if (rawProp.hasOwnProperty(p)) {
              if (o3.runTime === 1) {
                const eles: IDomElement[] = [];
                virtualElement.result = Raw(prop.children as VirtualElement[]);
                prop.children?.map((i: any) => {
                  renderResult(i as VirtualElement, virtualElement.native!);
                });
                // 将结果添加到dom中
              } else {
                const children = prop.children! as any[];
                const oldChildren = virtualElement.result as any[];
                if (children.length !== oldChildren.length) {
                  throw new Error("something happend in natvie children");
                }
                children.map((child, index) => {
                  const { result } = diffResult(
                    `${o3.id}-${index}`,
                    child,
                    oldChildren[index]
                  );
                  oldChildren[index] = result;
                });
              }
            } else {
              // children没了  要卸载掉
              unmountResult(virtualElement.result || []);
              virtualElement.result = undefined!;
              cb(o3.getTask());
            }
          });
        } else {
          // 正常的属性
          return new LazyTask((o3) => {
            // 对于children要做特殊心理
            if (rawProp.hasOwnProperty(p)) {
              const newV = prop[p];
              const oldV = o3.getData();
              if (newV !== oldV) {
                virtualElement.native?.removeAttribute(p, oldV);
                o3.setData(newV);
                // 设置属性
                virtualElement.native?.setAttribute(p, prop[p]);
              }
            } else {
              // 移除属性
              cb(o3.getTask());
            }
            return (isStop) =>
              isStop && virtualElement.native?.removeAttribute(p, o3.getData());
          });
        }
      };
      o1.addSubTask(
        new LazyTask((o2) => {
          // 处理所有的属性 同时要注意新增属性的情况
          const unsub = onLazyable("add", prop, (t, k) => {
            o2.addSubTask(
              handle(k as string, (t) => o2.removeSubTask(t, true))
            );
          });
          for (let i in prop) {
            o2.addSubTask(handle(i, (t) => o2.removeSubTask(t, true)));
          }
          return () => {
            // 停止所有的任务
            unsub();
          };
        })
      );
      return () => {
        virtualElement.Prop?.stop();
      };
    },
    {
      maxRunTime: 1,
    }
  );
  // return virtualElement.mainTask.getData() || [];
}
