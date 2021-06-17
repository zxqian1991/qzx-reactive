// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";

import { useCtx } from "./lazy/VirtualElements/Render/FunctionalRender";

let id = 0;
const data = Lazyable({
  count: 0,
  arr: generateArray(10, (i) => ({ value: i, id: id++ })),
} as { count: number; arr: { value: number; id: number }[]; ref: any; size: number });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <>
    <div>
      <button
        onClick={() => {
          const last = data.arr[data.arr.length - 1];
          data.arr.pop();
          data.arr.unshift(last);
        }}
      >
        最后一个放到最前面
      </button>
      <button onClick={() => data.count++}>count + 1</button>
      <button
        onClick={() => data.arr.unshift({ value: data.arr.length, id: id++ })}
      >
        新增
      </button>
      <button
        onClick={() => {
          data.arr.shift();
        }}
      >
        减少
      </button>
    </div>
    <div>
      {data.arr.map((i, index) => (
        <A key={i.id} value={i.value} />
      ))}
    </div>
  </>,
  lazyDocument.querySelector("#root")!
);

// 使用useState的好处是不会重复的创建对象而不用 稍微快些
function A(
  p: X.PropType<{ value: number }>,
  ctx = useCtx({
    state: {
      count: 0,
      age: 10,
    },
    computed: {
      test() {
        return this.state.count + this.state.age;
      },
      ss() {
        return this.state.count + this.computed.test;
      },
    },
  })
) {
  return (
    <div onClick={() => ctx.state.count++}>{ctx.state.count + p.value}</div>
  );
}
