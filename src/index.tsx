// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable, State, Stateable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";
import { useLife } from "./lazy/VirtualElements/Render/FunctionalRender";
import {
  useState,
  FunctionalOperate,
} from "./lazy/VirtualElements/Render/FunctionalRender";

const data = Lazyable({
  count: 0,
  arr: generateArray(5, (i) => ({ value: i })),
} as { count: number; arr: { value: number }[]; ref: any; size: number });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    <A />
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
      <div key={index} onClick={() => i.value++}>
        {i.value + data.arr.length + data.count}
      </div>
    ))}
  </div>,
  lazyDocument.querySelector("#root")!
);

// 使用useState的好处是不会重复的创建对象而不用 稍微快些
function A(p = {}, s = useState({ age: 1 })) {
  return <div onClick={() => s.age++}>{s.age}</div>;
}
