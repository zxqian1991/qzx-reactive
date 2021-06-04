// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable, State, Stateable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";

const data = Lazyable({
  count: 0,
  arr: generateArray(7000, (i) => ({ value: i })),
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
      <div key={index} onClick={() => data.count++}>
        {i.value + data.count + data.arr.length}
      </div>
    ))}
  </div>,
  lazyDocument.querySelector("#root")!
);
