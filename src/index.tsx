// import React from "react";
import Lazyman, { lazyDocument } from "./lazy/index";
import { Lazyable } from "./lazy/Lazyable";
import HTMLDOMDrive from "./lazy/LazyDom";
import { generateArray } from "./lazy/utils/Array";
import { Component } from "./lazy/Component";
import { PropType } from "./lazy/common";
import { useCreated, useMounted, useUnMounted } from "./lazy/VirtualElement";

class A extends Component {
  render() {
    return <B>{this.props.children}</B>;
  }
  onCreated() {
    console.log("component created");
    return () => console.log("component created unmount");
  }
  onMounted() {
    console.log("component mounted");
    return () => console.log("component mounted unmount");
  }
  onUnMounted() {
    console.log("component unmounted");
  }
}

function B(props: PropType) {
  useCreated(() => {
    console.log("func created");
    return () => console.log("func created unmounted");
  });
  useMounted(() => {
    console.log("func mounted");
    return () => console.log("func moutned unmounted");
  });
  useUnMounted(() => {
    console.log("func unmounted");
  });
  return <div>{props.children}</div>;
}

const data = Lazyable({
  arr: generateArray(3, (i) => i + i),
} as { count: number; arr: number[]; ref: any });
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <div>
    {data.arr.map((i, index) => (
      <A key={index}>
        <div key={index} onClick={() => data.arr[index]++}>
          {i}
        </div>
      </A>
    ))}
    <button onClick={() => data.arr.push(data.arr.length)}>增加数字</button>
    <button onClick={() => data.arr.pop()}>减少数字</button>
  </div>,
  lazyDocument.querySelector("#root")!
);
