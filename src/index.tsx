// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";

const data = Lazyable({
  ref: undefined,
  count: 1,
  arr: generateArray(4, (i) => i),
} as { count: number; arr: number[]; ref: any });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div onClick={() => data.count++}>
    <>{data.count}</>
  </div>,
  lazyDocument.querySelector("#root")!
);
