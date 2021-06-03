// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable, State, Stateable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";
import { Component } from "./lazy/Component";
import { PropType } from "./lazy/common";
import { useCreated, useMounted, useUnMounted } from "./lazy/VirtualElement";

const data = Lazyable({
  arr: generateArray(1000, (i) => i),
} as { count: number; arr: number[]; ref: any });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    {data.arr.map((i, index) => (
      <div key={index} onClick={() => data.arr[index]++}>
        {i}
      </div>
    ))}
  </div>,
  lazyDocument.querySelector("#root")!
);
