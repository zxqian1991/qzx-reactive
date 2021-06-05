import { LazyTask, IDomElement, Component, runExcludeTask } from "../..";
import { LazyProp } from "../../LazyProp";
import diffResult from "../diff";
import VirtualElement from "../index";
import { formatResult, renderResult } from "../common";
export default function ComponentRender(virtualElement: VirtualElement) {
  return new LazyTask<IDomElement[]>(
    (o1) => {
      // instance 要在prop之前 因为prop中要处理ref
      const unmount: (() => void)[] = [];
      o1.except(() => {
        virtualElement.instance =
          new (virtualElement.component as typeof Component)();
        virtualElement.Prop = new LazyProp(virtualElement);
        (virtualElement.instance as any)._prop = virtualElement.Prop.getProp();
        const r = virtualElement.instance.onCreated?.();
        if (r && typeof r === "function") {
          unmount.push(r);
        }
      });
      o1.addSubTask(
        new LazyTask((o2) => {
          const result = virtualElement.instance?.render();
          // 第一次运行 直接赋值
          if (o2.runTime === 1) {
            // 对结果做渲染
            const fr = runExcludeTask(() => {
              const fr = formatResult(result);
              o1.setData(renderResult(fr));
              return fr;
            });
            // 渲染完成后调用mounted函数
            const r = virtualElement.instance?.onMounted();
            if (r && typeof r === "function") {
              unmount.push(r);
            }
            virtualElement.result = fr;
          } else {
            // 非第一次，要比较 并返回最新结果
            diffResult(
              o2.id,
              formatResult(result),
              virtualElement.result!
            ).then(({ result: Res, elements }) => {
              virtualElement.result = Res;
              if (elements && elements.length > 0) {
                o1.setData(elements);
              }
            });
          }
        })
      );
      return () => {
        // 停止属性的监听
        virtualElement.Prop?.stop();
        // 停止渲染任务
        unmount.forEach((r) => r());
        virtualElement.instance?.onUnMounted();
      };
    },
    { maxRunTime: 1 }
  );
}
