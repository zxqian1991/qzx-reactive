// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";
import { PropType } from "./lazy/types";
import {
  useCtx,
  useCreated,
} from "./lazy/VirtualElements/Render/FunctionalRender";

const data = Lazyable({
  count: 0,
  arr: generateArray(5, (i) => ({ value: i })),
} as { count: number; arr: { value: number }[]; ref: any; size: number });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    <div>
      <button onClick={() => data.count++}>count + 1</button>
      <button onClick={() => data.arr.push({ value: data.arr.length })}>
        新增
      </button>
      <button
        onClick={() => {
          data.arr.pop();
        }}
      >
        减少
      </button>
    </div>
    {data.arr.map((i, index) => (
      <A
        key={index}
        onClick={() => i.value++}
        value={i.value + data.arr.length + data.count}
      />
    ))}
  </div>,
  lazyDocument.querySelector("#root")!
);

// 使用useState的好处是不会重复的创建对象而不用 稍微快些
function A(
  p: PropType<{ onClick: any; value: number }>,
  ctx = useCtx({
    state: {
      count: 1,
    },
    computed: {
      size(): number {
        // console.log("i am size");
        return p.value + this.state.count;
      },
    },
    lifeCycle: {
      onCreated() {
        console.log("i am created", p.value);
        return () => console.log("i am created Unmount");
      },
      onMounted() {
        return () => console.log("i am mounted Unmount");
      },
    },
    methods: {
      addCount() {
        this.state.count++;
      },
    },
  })
) {
  return <div onClick={ctx.addCount}>{ctx.computed.size}</div>;
}
