import VirtualElement from "..";
import {
  LazyTask,
  IDomElement,
  FunctionalValue,
  runExcludeTask,
  flattern,
} from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import { formatResult, renderResult } from "../common";

export default function FragmentRender(virtualElement: VirtualElement) {
  return new LazyTask<IDomElement[]>(
    (o1) => {
      // 这是被处理过的fragment

      virtualElement.Prop = o1.except(() => {
        return new LazyProp(virtualElement);
      });
      const prop = virtualElement.Prop.getProp();
      o1.addSubTask(
        new LazyTask((o2) => {
          if (typeof virtualElement.id === "string") {
            const children = prop.children || [];
            if (children.length <= 0)
              throw new Error("formatted fragment can not be Empty");
            const h = children[0] as FunctionalValue;
            const res = h();
            const fr = runExcludeTask(() => {
              return formatResult(res);
            });
            if (o2.runTime === 1) {
              renderResult(fr, virtualElement.parent!);
              virtualElement.result = fr;
            } else {
              const { result: Res } = diffResult(
                o2.id,
                fr,
                virtualElement.result!
              );
              virtualElement.result = Res;
            }
          } else {
            if (o2.runTime === 1) {
              const children = prop.children as VirtualElement[];
              children.map((i) => renderResult(i, virtualElement.parent!));
              virtualElement.result = children;
            } else {
              const { result } = diffResult(
                o2.id,
                prop.children as VirtualElement[],
                virtualElement.result!
              );
              virtualElement.result = result;
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
