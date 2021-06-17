// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";
import { useCtx } from "./lazy/VirtualElements/Render/FunctionalRender";

let id = 0;
const data = Lazyable({
  count: 0,
  arr: generateArray(1, (i) => ({ value: i, id: id++ })),
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
      <button onClick={() => data.count++}>count + 1 {data.count}</button>
      <button onClick={() => data.count--}>count - 1 {data.count}</button>
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
        <A key={i.id} value={i.value}>
          <span>你好@</span>
        </A>
      ))}
    </div>
  </>,
  lazyDocument.querySelector("#root")!
);

// 使用useState的好处是不会重复的创建对象而不用 稍微快些
function A(
  p: X.PropType<{ value: number }>,
  ctx = useCtx({
    lifeCycle: {
      onMounted: function () {
        this.store.age = 129;
      },
    },
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
    <div>
      <div onClick={() => ctx.store.age!++}>
        {ctx.state.count + p.value}:{ctx.store.age}
      </div>
      <B>
        {p.children}
        <input onClick={() => console.log("click input")} />
        <>laksdm</>
      </B>
    </div>
  );
}

function B(
  p: X.PropType<{}>,
  ctx = useCtx({
    injectChildProp: (child, prop) => {
      const onClick = prop.onClick;
      prop.onClick = () => {
        // originOnchange();
        onClick();
        console.log("new OnChange");
      };
      let size = 13;
      prop.style = { color: "red", "font-size": `${size}px` };
      // console.log(prop, prop.onChange);
      // setInterval(() => {
      //   prop.style["font-size"] = `${++size}px`;
      // }, 1000);
    },
  })
) {
  return (
    <div
      onClick={() => {
        ctx.store.age! += 4;
      }}
    >
      {ctx.store.age}
      {p.children}
    </div>
  );
}
