// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";

const data = Lazyable({
  arr: generateArray(3, (i) => i + i),
} as { count: number; arr: number[]; ref: any });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    {data.arr.map((i, index) => (
      <div key={index} onClick={() => data.arr[index]++}>
        {i}
      </div>
    ))}
    <button onClick={() => data.arr.push(data.arr.length)}>增加数字</button>
    <button onClick={() => data.arr.pop()}>减少数字</button>
  </div>,
  lazyDocument.querySelector("#root")!
);
