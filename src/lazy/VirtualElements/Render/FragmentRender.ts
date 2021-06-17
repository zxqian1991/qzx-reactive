import VirtualElement from "..";
import { LazyTask, runExcludeTask } from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { formatResult, renderResult } from "../common";
import { Raw } from "../../Lazyable";

export default function FragmentRender(virtualElement: VirtualElement) {
  return new LazyTask<X.IDomElement[]>(
    (o1) => {
      // 这是被处理过的fragment
      virtualElement.Prop = o1.except(() => {
        return new LazyProp(virtualElement);
      });
      const prop = virtualElement.Prop.getProp();
      // const rawProp = Raw(prop);
      o1.addSubTask(
        new LazyTask((o2) => {
          if (typeof virtualElement.id === "string") {
            const children = prop.children || [];
            const rawChildren = Raw(children);
            if (rawChildren.length <= 0)
              throw new Error("formatted fragment can not be Empty");
            const h = children[0] as X.FunctionalValue;
            const res = h();
            const fr = runExcludeTask(() => {
              return formatResult(res);
            });
            if (o2.runTime === 1) {
              renderResult(
                fr,
                virtualElement.position!,
                virtualElement.level,
                virtualElement.ctx
              );
              virtualElement.result = fr;
            } else {
              const { result: Res } = diffResult(
                o2.id,
                fr,
                virtualElement.result!,
                virtualElement.level,
                virtualElement.ctx
              );
              virtualElement.result = Res;
            }
          } else {
            const children = prop.children as VirtualElement[];
            const rawChildren = Raw(children);
            virtualElement.result = rawChildren;
            for (let i = 0; i < rawChildren.length; i++) {
              o2.addSubTask(
                new LazyTask((o3) => {
                  if (o3.runTime === 1) {
                    const child = children[i];
                    renderResult(
                      child,
                      virtualElement.position!,
                      virtualElement.level,
                      virtualElement.ctx
                    );
                  } else {
                    const { result } = diffResult(
                      o2.id,
                      children[i],
                      (virtualElement.result! as any)[i],
                      virtualElement.level,
                      virtualElement.ctx
                    );
                    (virtualElement.result as any)[i] = result;
                  }
                })
              );
            }
          }
        })
      );
    },
    {
      maxRunTime: 1,
    }
  );
}
