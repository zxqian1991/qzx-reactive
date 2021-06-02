// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable, Raw } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";

const data = Lazyable({
  ref: undefined,
  count: 1,
  arr: generateArray(4, (i) => i),
} as { count: number; arr: number[]; ref: any });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    <div>
      <button
        onClick={() => {
          data.arr.push(data.arr.length);
        }}
      >
        增加新的值
      </button>
      <button
        onClick={() => {
          data.arr.pop();
        }}
      >
        减少新的值
      </button>
    </div>
    <div>
      {data.arr.map((i, index) => (
        <div
          key={index}
          onClick={() => {
            data.arr[index]++;
          }}
        >
          {i}
        </div>
      ))}
    </div>
  </div>,
  lazyDocument.querySelector("#root")!
);
