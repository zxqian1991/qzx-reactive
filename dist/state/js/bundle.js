/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lazy_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lazy/index */ "./src/lazy/index.ts");
/* harmony import */ var _lazy_Lazyable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lazy/Lazyable */ "./src/lazy/Lazyable.ts");
/* harmony import */ var _lazy_LazyDom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lazy/LazyDom */ "./src/lazy/LazyDom.ts");
/* harmony import */ var _lazy_utils_Array__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lazy/utils/Array */ "./src/lazy/utils/Array.ts");
// import React from "react";




var data = (0,_lazy_Lazyable__WEBPACK_IMPORTED_MODULE_1__.Lazyable)({
  ref: undefined,
  count: 1,
  arr: (0,_lazy_utils_Array__WEBPACK_IMPORTED_MODULE_3__.generateArray)(4, i => i)
});
_lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.drive(_lazy_LazyDom__WEBPACK_IMPORTED_MODULE_2__.default);
_lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.render(_lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(6, () => null, "div", [], [() => _lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(3, () => null, "div", [], [() => _lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(1, () => null, "button", [{
  "type": "normal",
  "property": "onClick",
  "value": () => () => {
    console.log(1234);
    data.arr.push(21);
    console.log(data.arr);
  }
}], [() => "\u589E\u52A0\u65B0\u7684\u503C"]), () => _lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(2, () => null, "button", [{
  "type": "normal",
  "property": "onClick",
  "value": () => () => {
    data.arr.pop();
  }
}], [() => "\u51CF\u5C11\u65B0\u7684\u503C"])]), () => _lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(5, () => null, "div", [], [() => data.arr.map((i, index) => _lazy_index__WEBPACK_IMPORTED_MODULE_0__.default.createElement(4, () => index, "div", [{
  "type": "normal",
  "property": "onClick",
  "value": () => () => {
    data.arr[index]++;
  }
}], [() => i]))])]), _lazy_index__WEBPACK_IMPORTED_MODULE_0__.lazyDocument.querySelector("#root"));

/***/ }),

/***/ "./src/lazy/Component.ts":
/*!*******************************!*\
  !*** ./src/lazy/Component.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "COMPONENT_FLAG": () => (/* binding */ COMPONENT_FLAG),
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var COMPONENT_FLAG = Symbol("COMPONENT_FLAG");
class Component {
  get props() {
    return this._prop || {};
  }

  onMounted() {}

  onCreated() {}

  onUnMounted() {}

  render() {
    return undefined;
  }

  constructor() {
    _defineProperty(this, "_prop", void 0);
  }

}

_defineProperty(Component, COMPONENT_FLAG, true);

/***/ }),

/***/ "./src/lazy/Document.ts":
/*!******************************!*\
  !*** ./src/lazy/Document.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LazyDocument": () => (/* binding */ LazyDocument),
/* harmony export */   "lazyDocument": () => (/* binding */ lazyDocument)
/* harmony export */ });
class LazyDocument {
  isTextElement(d) {
    return undefined;
  }

  createTextElement(t) {
    return undefined;
  }

  createElement(t) {
    return undefined;
  }

  querySelector(k) {
    return null;
  }

  querySelectorAll() {
    return null;
  }

  getPosition(elements) {
    if (elements.length <= 0) throw new Error("no elements can use");
    var lastElement = elements[elements.length - 1];
    return {
      nextSibling: lastElement.nextSibling,
      parent: lastElement.parent,
      preSibling: lastElement.preSibling
    };
  }

  insertElements(elements, position) {
    if (position.nextSibling) {
      var _position$parent;

      (_position$parent = position.parent) === null || _position$parent === void 0 ? void 0 : _position$parent.insertBefore(elements, position.nextSibling);
    } else if (position.parent) {
      position.parent.append(elements);
    } else {
      throw new Error("position is invalid!");
    }
  }

  replaceElements(newElements, oldElements) {
    var position = this.getPosition(oldElements);
    oldElements.forEach(ele => ele.remove());
    this.insertElements(newElements, position);
  }

}
var lazyDocument = new LazyDocument();


/***/ }),

/***/ "./src/lazy/LazyDom.ts":
/*!*****************************!*\
  !*** ./src/lazy/LazyDom.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_Object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/Object */ "./src/lazy/utils/Object.ts");


class MyBaseElement {
  isText() {
    return this.dom instanceof Text;
  }

  getText() {
    var _this$dom;

    return this.isText() ? this.dom.textContent : (_this$dom = this.dom) === null || _this$dom === void 0 ? void 0 : _this$dom.innerText;
  }

  constructor(dom) {
    this.dom = dom;
  }

  append(eles) {
    eles.forEach(ele => {
      // 得保证都是 MyBaseElement类型 Ts的优势出来了
      if (ele instanceof MyBaseElement) {
        this.dom.appendChild(ele.dom);
      }
    });
  }

  get nextSibling() {
    var sib = this.dom.nextSibling || this.dom.nextElementSibling;
    if (!sib) return null;
    return new MyBaseElement(sib);
  }

  get preSibling() {
    var sib = this.dom.previousSibling || this.dom.previousElementSibling;
    if (!sib) return null;
    return new MyBaseElement(sib);
  }

  get parent() {
    var parent = this.dom.parentElement || this.dom.parentNode;
    if (!parent) return null;
    return new MyBaseElement(parent);
  }

  insertBefore(doms, target) {
    if (!(target instanceof MyBaseElement)) throw new Error("target to insert must be MyBaseElement Type");
    doms.forEach(dom => {
      if (dom instanceof MyBaseElement) {
        this.dom.insertBefore(dom.dom, target.dom);
      }
    });
  }

  setAttribute(attr, value) {
    var _this$dom2;

    if (attr === "key") return;

    if ((_this$dom2 = this.dom) !== null && _this$dom2 !== void 0 && _this$dom2.setAttribute) {
      // 处理事件
      if (/^on\w+/gi.test(attr)) {
        var eventname = attr.toLowerCase().replace(/^on/gi, "");
        this.dom.addEventListener(eventname, value);
        return;
      }

      switch (attr) {
        case "className":
          var tv = classNames(value);

          if (tv) {
            this.dom.setAttribute("class", tv);
          }

          break;

        case "style":
          var s = style(value);

          if (s) {
            this.dom.setAttribute("style", s);
          }

          break;

        default:
          this.dom.setAttribute(attr, value);
      }
    }
  }

  removeAttribute(attr, value) {
    var _this$dom3;

    if (/^on\w+/gi.test(attr)) {
      var eventname = attr.toLowerCase().replace(/^on/gi, "");
      this.dom.removeEventListener(eventname, value);
      return;
    }

    if ((_this$dom3 = this.dom) !== null && _this$dom3 !== void 0 && _this$dom3.removeAttribute) {
      switch (attr) {
        case "className":
          this.dom.removeAttribute("class");
          break;

        default:
          this.dom.removeAttribute(attr);
      }
    }
  }

  remove() {
    return this.dom.remove();
  } // 清空子节点


  clear() {
    if (this.dom instanceof Text) {
      this.dom.textContent = "";
    } else {
      this.dom.innerHTML = "";
    }
  }

}

var HTMLDOMDrive = {
  createTextElement(v) {
    return new MyBaseElement(new Text(v));
  },

  isTextElement(v) {
    return v instanceof MyBaseElement && v.isText();
  },

  createElement(dom) {
    return new MyBaseElement(document.createElement(dom));
  },

  querySelector(v) {
    var r = document.querySelector(v);
    if (r) return new MyBaseElement(r);
    return null;
  },

  querySelectorAll(v) {
    var rs = document.querySelectorAll(v);
    if (rs) return Array.from(rs).map(r => new MyBaseElement(r));
    return null;
  }

};
/* harmony default export */ __webpack_exports__["default"] = (HTMLDOMDrive);

function className(classname) {
  if (!classname) return;

  if (typeof classname === "string") {
    return classname;
  }

  if (Array.isArray(classname)) {
    return classname.map(className).filter(c => c).join(" ");
  }

  return className(Object.keys(classname).filter(prop => classname[prop]).map(prop => prop));
}

function classNames(...classnames) {
  return className(classnames.map(className));
}
/**
 * 对style的处理 这里是简单的、初级的
 * @param value
 * @returns
 */


function style(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") return (0,_utils_Object__WEBPACK_IMPORTED_MODULE_0__.joinObject)(value, "&").trim();
  return undefined;
}

/***/ }),

/***/ "./src/lazy/LazyProp.ts":
/*!******************************!*\
  !*** ./src/lazy/LazyProp.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LazyProp": () => (/* binding */ LazyProp)
/* harmony export */ });
/* harmony import */ var _Lazyable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lazyable */ "./src/lazy/Lazyable.ts");
/* harmony import */ var _LazyTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LazyTask */ "./src/lazy/LazyTask.ts");
/* harmony import */ var _VirtualElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VirtualElement */ "./src/lazy/VirtualElement.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-05-08 13:39:28
 * @modify date 2021-05-08 13:39:28
 * @desc [自动响应的对象]
 */

class LazyProp {
  // 对外暴露的prop，是一个lazyable的对象
  // prop的主任务 用来控制任务的运行
  // 对外暴露的方法，用以获取prop
  getProp() {
    return this.prop;
  } // 存储所有属性的地方(一个属性可能对象都拥有，某一个对象的属性被删除了 下一个要接替。)


  constructor( // private id: number | string,
  // private key: FunctionalValue | undefined,
  virualElemet // private props: FunctionalProp[] = [], // private children: FunctionalValue[] = []
  ) {
    this.virualElemet = virualElemet;

    _defineProperty(this, "prop", (0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.Lazyable)({}));

    _defineProperty(this, "mainTask", void 0);

    _defineProperty(this, "store", new Map());

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "key", void 0);

    _defineProperty(this, "props", []);

    _defineProperty(this, "children", []);

    this.id = this.virualElemet.id;
    this.key = this.virualElemet.key;
    this.props = this.virualElemet.props;
    this.children = this.virualElemet.children;
    this.init();
  } // props里面可能是存在children属性的 但是 只要this.children存在就表示props里面的children都是无效的


  canHandleChildren(property) {
    return property && this.children && property === "children" && this.children.length > 0;
  } // 给prop赋值children 同时标记这个children是一个属于组件子节点的children 便于控制


  handleChildren() {
    if (typeof this.id === "string") {
      this.prop.children = this.children;
      return;
    } // fragment类型的数据不用处理


    var result = this.children.map((i, index) => new _VirtualElement__WEBPACK_IMPORTED_MODULE_2__.default("".concat(this.id), () => "".concat(this.id, "-").concat(index), "fragment", [], [i])); // 给children重新赋值 这回触发更新 更新时根据key + fragment进行对比

    this.prop.children = result;
  }
  /**
   * 处理普通的属性
   * @param p
   * @param i
   * @returns
   */


  handleNormal(p, i) {
    var property = p.property;

    if (property) {
      // 是children的话 什么都不用做
      if (this.canHandleChildren(property)) {
        return;
      }

      if (property === "ref") {
        return this.handleRef(p.value);
      }

      var rawProp = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.Raw)(this.prop); // 不是children的话 就要创建这个任务 任务默认不启动 在addProperty中进行控制

      var task = new _LazyTask__WEBPACK_IMPORTED_MODULE_1__.LazyTask(o => {
        // 重新赋值属性 并重新记录依赖
        var value = p.value();
        var originValue = rawProp[property];

        if (value !== originValue) {
          this.prop[property] = value;
        }
      }, {
        autoRun: false
      }); // 将属性添加到store中

      this.addProperty(property, i, task);
    }
  }

  handleRef(value) {
    // 处理REF 主要是返回
    var target;
    var key;
    var unsub = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.onLazyable)("get", (t, k, v) => {
      target = t;
      key = k;
    });
    value();
    unsub();

    if (target !== undefined && key !== undefined) {
      target[key] = this.virualElemet.native || this.virualElemet.instance;
    }
  }
  /**
   * 移除一个属性
   * @param property 属性名字
   * @param index 属性所在的位置
   * @param onMatch 移除时调用的函数
   */


  removeProperty(property, index, onMatch) {
    if (this.store.has(property)) {
      var arr = this.store.get(property); // 过滤符合条件的

      var filtResult = arr === null || arr === void 0 ? void 0 : arr.filter(v => {
        var match = v.index === index;

        if (match) {
          // 符合条件 移除这个任务
          // restTask.stopExceptSubTask(v.task);
          v.task.stop();
          onMatch === null || onMatch === void 0 ? void 0 : onMatch(v);
        }

        return !match; // 留下的肯定是没匹配的 别弄错了
      }); // 最后一个任务自动重启

      if (filtResult && filtResult.length > 0 && filtResult[filtResult.length - 1].task.hasStopped()) {
        filtResult[filtResult.length - 1].task.restart([], true);
      }

      this.store.set(property, filtResult);
    }
  }

  handleRest(p, i) {
    var _this = this;

    // 有一个任务单独的去监听对象的变化
    var restProperties = new Set(); // 储存的上一次的值 来判断是否需要重新计算

    var value;
    return new _LazyTask__WEBPACK_IMPORTED_MODULE_1__.LazyTask(o => {
      // 重新计算  会产生新的依赖
      var restValue = p.value(); // 两个值不一样 那得清空上一个值得信息

      if (value !== restValue) {
        // 之前记录了这个rest的值有哪些属性 在这里我们要将这些相关的信息都清空 以便重新计算
        restProperties.forEach(property => // 移除属性的同时会自动的启停任务
        this.removeProperty(property, i)); // 清空旧值的基本信息

        restProperties.clear(); // 移除旧值的监听

        o.lastUnsub(); // 监听新增属性的逻辑

        var unsub = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.onLazyable)("add", restValue, (t, property, v) => {
          // 判断是否呀哦处理children
          if (this.canHandleChildren(property)) {
            return;
          }

          if (property === "ref") {
            return this.handleRef(() => restValue["ref"]);
          } // 添加到属性存储中


          restProperties.add(property);
          var rawProp = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.Raw)(this.prop); // 新建属性的监听任务

          var pTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_1__.LazyTask(() => {
            // 直接赋值
            if (restValue.hasOwnProperty(property)) {
              var originValue = rawProp[property];
              var _value = restValue[property];

              if (originValue !== _value) {
                this.prop[property] = _value;
              }
            } else {
              // 不存在这个属性了  表示这个属性被删了
              restProperties.delete(property); // 移除store中的存储

              this.removeProperty(property, i);
            }
          }, {
            autoRun: false
          }); // 把这个加入到监听属性中去

          this.addProperty(property, i, pTask);
        }); // 监听函数没有在任务最后自动销毁  因为可能是同一个值，新建销毁的是没必要的浪费
        // 遍历它所有的属性

        var _loop = function (property) {
          // 保存当前所有的属性
          if (_this.canHandleChildren(property)) {
            return "continue";
          }

          if (property === "ref") {
            return {
              v: _this.handleRef(() => restValue["ref"])
            };
          }

          restProperties.add(property); // 新建属性的监听任务

          var pTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_1__.LazyTask(() => {
            if (restValue.hasOwnProperty(property)) {
              _this.prop[property] = restValue[property];
            } else {
              // 不存在这个属性了  表示这个属性被删了
              restProperties.delete(property);

              _this.removeProperty(property, i, v => v.task.stop());
            }
          }, {
            autoRun: false
          });

          _this.addProperty(property, i, pTask);
        };

        for (var property in restValue) {
          var _ret = _loop(property);

          if (_ret === "continue") continue;
          if (typeof _ret === "object") return _ret.v;
        } // 要移除对新增属性的事件的监听


        return () => unsub();
      } else {
        // 值一样 咱就不管 返回上个任务的回调 便于最后销毁的时候调用
        return o.lastUnsub;
      } // 两个值相等 啥都不用做

    }, {
      autoUnsub: false
    });
  }
  /**
   * 添加一个新的属性到store中去
   * 如果是最后一个 要停止上一个任务 开始新的任务
   * @param property
   * @param index
   * @param task
   */


  addProperty(property, index, task) {
    if (!this.store.has(property)) {
      this.store.set(property, []);
    } // 先获取这个属性存储的结果


    var storeArr = this.store.get(property); // 进件存储的内容

    var data = {
      index,
      task
    }; // 结果是空的 说明没别的属性位置 直接运行

    if (storeArr.length === 0) {
      storeArr.push(data);
      data.task.restart();
    } else if (index > storeArr[storeArr.length - 1].index) {
      // 位置比最后一个值还靠后 那就停止最后一个 同时启动自己 （这个存储的数组的index肯定是有小到大的、有序的）
      storeArr[storeArr.length - 1].task.stop();
      storeArr.push(data);
      task.restart();
    } else {
      /**
       * 找出比自己小的
       * 找的过程可以进一步优化
       */
      for (var i = storeArr.length - 1; i >= 0; i--) {
        // 找到了 就在下一个位置插入自己
        if (storeArr[i].index < index) {
          storeArr.splice(i + 1, 0, data);
        } else if (i === 0) {
          // 找不到 同时已经到头了 就在最前面插入
          storeArr.splice(0, 0, data);
        }
      }
    }
  }
  /**
   * 初始化prop
   */


  init() {
    // children可以处理 先处理下children
    if (this.canHandleChildren("children")) {
      this.handleChildren();
    } // 开启主任务


    this.mainTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_1__.LazyTask(o => {
      // key传递给后代 防止要用
      if (this.key) {
        this.handleNormal({
          type: "normal",
          property: "key",
          value: this.key
        }, -1);
      }

      for (var i = 0; i < this.props.length; i++) {
        var p = this.props[i];

        if (p.type === "normal") {
          // 处理普通的属性 这本身会生成一个任务 任务会被存放在store中去 所以不必单独添加
          this.handleNormal(p, i);
        } else if (p.type === "rest") {
          /**
           * 处理rest属性
           * 不同的是，rest的属性本身也是一个值对象 它自身会有很多的依赖 因此这个任务需要
           */
          o.addSubTask(this.handleRest(p, i));
        }
      }

      return () => {
        this.store.forEach(v => v.forEach(i => i.task.stop()));
        this.store.clear();
      };
    }, {
      maxRunTime: 1 // 主任务最多运行一次

    });
  }

  stop() {
    var _this$mainTask;

    (_this$mainTask = this.mainTask) === null || _this$mainTask === void 0 ? void 0 : _this$mainTask.stop();
    this.mainTask = undefined;
  }

  update(id, props = [], children = []) {
    // 先获取到旧的属性列表
    var oldSet = new Set(this.store.keys()); // 停止一切的任务 + 清空store

    this.stop();
    this.id = id;
    this.props = props;
    this.children = children; // 重新计算

    this.init(); // 获取新计算得到的属性列表

    var newSet = new Set(this.store.keys()); // 过滤相同的属性 留下不同的

    newSet.forEach(property => oldSet.delete(property)); // 移除不需要的属性

    oldSet.forEach(property => delete this.prop[property]);
  }

}

/***/ }),

/***/ "./src/lazy/LazyTask.ts":
/*!******************************!*\
  !*** ./src/lazy/LazyTask.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRunningTask": () => (/* binding */ getRunningTask),
/* harmony export */   "runExcludeTask": () => (/* binding */ runExcludeTask),
/* harmony export */   "LazyTask": () => (/* binding */ LazyTask)
/* harmony export */ });
/* harmony import */ var _Lazyable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lazyable */ "./src/lazy/Lazyable.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/lazy/utils/index.ts");
var _class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }



/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-05-28 15:43:24
 * @modify date 2021-05-28 15:43:24
 * @desc [description] 执行任务并记录依赖
 */

var TMEP_RUNNING_TASK;
function getRunningTask() {
  return TMEP_RUNNING_TASK;
}

function setRunnintTask(task) {
  TMEP_RUNNING_TASK = task;
}

function runExcludeTask(h) {
  if (TMEP_RUNNING_TASK) {
    return TMEP_RUNNING_TASK.except(() => h());
  }

  return h();
}
var LazyTask = (_class = class LazyTask {
  // 停止记录依赖
  stopRecordRely() {
    this.canRecordRely = false;
  } // 可以记录以来


  startRecordRely() {
    this.canRecordRely = true;
  }

  constructor(handler, option = {}) {
    this.handler = handler;
    this.option = option;

    _defineProperty(this, "stopped", false);

    _defineProperty(this, "unsub", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "debounce", void 0);

    _defineProperty(this, "time", 0);

    _defineProperty(this, "changeReasons", []);

    _defineProperty(this, "canRecordRely", true);

    _defineProperty(this, "subTasks", new Set());

    if (this.option.autoRun || this.option.autoRun === undefined) {
      this.run();
    }

    this.debounce = typeof this.option.debounce === "number" && this.option.debounce >= 0 || this.option.debounce === true ? new _utils__WEBPACK_IMPORTED_MODULE_1__.Debounce(this.option.debounce === true ? 0 : this.option.debounce || 0) : undefined;
  }

  canRecord(t, k, v) {
    if (!this.canRecord) return false;
    if (!this.option.notRecord || typeof this.option.notRecord !== "function") return true;
    return !this.option.notRecord(t, k, v);
  }

  run(reasons) {
    var _this$unsub;

    if (this.stopped) {
      throw new Error("任务已终止！");
    }

    var lastTask = getRunningTask();
    setRunnintTask(this);
    var shouldAutoUnsub = this.option.autoUnsub || this.option.autoUnsub === undefined;
    shouldAutoUnsub && ((_this$unsub = this.unsub) === null || _this$unsub === void 0 ? void 0 : _this$unsub.call(this, false));
    var lastUnsub = shouldAutoUnsub ? () => {} : () => {
      var _this$unsub2;

      return (_this$unsub2 = this.unsub) === null || _this$unsub2 === void 0 ? void 0 : _this$unsub2.call(this, false);
    };
    removeRely(this);
    this.unsub = this.handler({
      runTime: ++this.time,
      except: this.except,
      getData: this.getData,
      setData: this.setData,
      lastUnsub,
      getTask: () => this,
      // removeRely: () => removeRely(this),
      reasons,
      addSubTask: this.addSubTask,
      removeSubTask: this.removeSubTask,
      stop: this.stop
    }) || undefined;
    setRunnintTask(lastTask);
  }

  except(h) {
    this.stopRecordRely();
    var res = h();
    this.startRecordRely();
    return res;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
  /**
   * 停止执行任务
   */


  stop() {
    var _this$unsub3;

    // 清理子任务
    // 清理子任务
    if (this.stopped) return;
    this.stopped = true;
    (_this$unsub3 = this.unsub) === null || _this$unsub3 === void 0 ? void 0 : _this$unsub3.call(this, true);
    this.unsub = undefined;
    removeRely(this);
    this.subTasks.forEach(t => t.stop());
    this.subTasks.clear();
    this.data = undefined;
    this.changeReasons = [];
  }

  hasStopped() {
    return this.stopped;
  }

  restart(reasons, force = false) {
    if (!force && this.stopped) return;

    if (!this.debounce) {
      this.run(reasons);
    } else {
      // 叠加理由
      reasons === null || reasons === void 0 ? void 0 : reasons.forEach(r => this.changeReasons.push(r));
      this.debounce.execute(() => {
        if (this.stopped) return;
        this.run(this.changeReasons);
        this.changeReasons = []; // 重置理由
      });
    }
  }

  addSubTask(task) {
    this.subTasks.add(task);
  }

  removeSubTask(task, stop = true) {
    if (stop) task.stop();
    this.subTasks.delete(task);
  }

}, (_applyDecoratedDescriptor(_class.prototype, "except", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "except"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setData", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "setData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getData", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "getData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "stop", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "stop"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addSubTask", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "addSubTask"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "removeSubTask", [_utils__WEBPACK_IMPORTED_MODULE_1__.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "removeSubTask"), _class.prototype)), _class);
// 任务依赖了哪些对象的哪些属性
var TASK_TARGET_RELY = new Map(); // 对象的哪些属性被哪些对象依赖了

var TARGET_TASK_RELY = new Map();

function addRely(task, t, k) {
  var _TASK_TARGET_RELY$get, _TASK_TARGET_RELY$get3, _TASK_TARGET_RELY$get4, _TARGET_TASK_RELY$get, _TARGET_TASK_RELY$get3, _TARGET_TASK_RELY$get4;

  if (!TASK_TARGET_RELY.has(task)) {
    TASK_TARGET_RELY.set(task, new Map());
  }

  if (!((_TASK_TARGET_RELY$get = TASK_TARGET_RELY.get(task)) !== null && _TASK_TARGET_RELY$get !== void 0 && _TASK_TARGET_RELY$get.has(t))) {
    var _TASK_TARGET_RELY$get2;

    (_TASK_TARGET_RELY$get2 = TASK_TARGET_RELY.get(task)) === null || _TASK_TARGET_RELY$get2 === void 0 ? void 0 : _TASK_TARGET_RELY$get2.set(t, new Set());
  }

  (_TASK_TARGET_RELY$get3 = TASK_TARGET_RELY.get(task)) === null || _TASK_TARGET_RELY$get3 === void 0 ? void 0 : (_TASK_TARGET_RELY$get4 = _TASK_TARGET_RELY$get3.get(t)) === null || _TASK_TARGET_RELY$get4 === void 0 ? void 0 : _TASK_TARGET_RELY$get4.add(k);

  if (!TARGET_TASK_RELY.has(t)) {
    TARGET_TASK_RELY.set(t, new Map());
  }

  if (!((_TARGET_TASK_RELY$get = TARGET_TASK_RELY.get(t)) !== null && _TARGET_TASK_RELY$get !== void 0 && _TARGET_TASK_RELY$get.has(k))) {
    var _TARGET_TASK_RELY$get2;

    (_TARGET_TASK_RELY$get2 = TARGET_TASK_RELY.get(t)) === null || _TARGET_TASK_RELY$get2 === void 0 ? void 0 : _TARGET_TASK_RELY$get2.set(k, new Set());
  }

  (_TARGET_TASK_RELY$get3 = TARGET_TASK_RELY.get(t)) === null || _TARGET_TASK_RELY$get3 === void 0 ? void 0 : (_TARGET_TASK_RELY$get4 = _TARGET_TASK_RELY$get3.get(k)) === null || _TARGET_TASK_RELY$get4 === void 0 ? void 0 : _TARGET_TASK_RELY$get4.add(task);
}

function removeRely(task) {
  var t = TASK_TARGET_RELY.get(task);
  TASK_TARGET_RELY.delete(task);
  t === null || t === void 0 ? void 0 : t.forEach((keys, target) => {
    keys.forEach(key => {
      var _TARGET_TASK_RELY$get5, _TARGET_TASK_RELY$get6, _TARGET_TASK_RELY$get7, _TARGET_TASK_RELY$get8, _TARGET_TASK_RELY$get10;

      (_TARGET_TASK_RELY$get5 = TARGET_TASK_RELY.get(target)) === null || _TARGET_TASK_RELY$get5 === void 0 ? void 0 : (_TARGET_TASK_RELY$get6 = _TARGET_TASK_RELY$get5.get(key)) === null || _TARGET_TASK_RELY$get6 === void 0 ? void 0 : _TARGET_TASK_RELY$get6.delete(task);

      if (((_TARGET_TASK_RELY$get7 = TARGET_TASK_RELY.get(target)) === null || _TARGET_TASK_RELY$get7 === void 0 ? void 0 : (_TARGET_TASK_RELY$get8 = _TARGET_TASK_RELY$get7.get(key)) === null || _TARGET_TASK_RELY$get8 === void 0 ? void 0 : _TARGET_TASK_RELY$get8.size) === 0) {
        var _TARGET_TASK_RELY$get9;

        (_TARGET_TASK_RELY$get9 = TARGET_TASK_RELY.get(target)) === null || _TARGET_TASK_RELY$get9 === void 0 ? void 0 : _TARGET_TASK_RELY$get9.delete(key);
      }

      if (((_TARGET_TASK_RELY$get10 = TARGET_TASK_RELY.get(target)) === null || _TARGET_TASK_RELY$get10 === void 0 ? void 0 : _TARGET_TASK_RELY$get10.size) === 0) {
        TARGET_TASK_RELY.delete(target);
      }
    });
  });
}

(0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.onLazyable)("get", (t, k, v) => {
  // 任务得允许被记录
  if (TMEP_RUNNING_TASK && TMEP_RUNNING_TASK.canRecord(t, k, v)) {
    addRely(TMEP_RUNNING_TASK, t, k);
  }
});
(0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.onLazyable)("set", (t, k, v, ov, isAdd) => {
  var _TARGET_TASK_RELY$get11, _TARGET_TASK_RELY$get12;

  (_TARGET_TASK_RELY$get11 = TARGET_TASK_RELY.get(t)) === null || _TARGET_TASK_RELY$get11 === void 0 ? void 0 : (_TARGET_TASK_RELY$get12 = _TARGET_TASK_RELY$get11.get(k)) === null || _TARGET_TASK_RELY$get12 === void 0 ? void 0 : _TARGET_TASK_RELY$get12.forEach(task => {
    task.restart([{
      target: t,
      key: k,
      type: isAdd ? "add" : "set",
      value: v,
      oldValue: ov
    }]);
  });
});
(0,_Lazyable__WEBPACK_IMPORTED_MODULE_0__.onLazyable)("delete", (t, k, ov) => {
  var _TARGET_TASK_RELY$get13, _TARGET_TASK_RELY$get14;

  (_TARGET_TASK_RELY$get13 = TARGET_TASK_RELY.get(t)) === null || _TARGET_TASK_RELY$get13 === void 0 ? void 0 : (_TARGET_TASK_RELY$get14 = _TARGET_TASK_RELY$get13.get(k)) === null || _TARGET_TASK_RELY$get14 === void 0 ? void 0 : _TARGET_TASK_RELY$get14.forEach(task => {
    task.restart([{
      target: t,
      key: k,
      type: "delete",
      value: undefined,
      oldValue: ov
    }]);
  });
});

/***/ }),

/***/ "./src/lazy/Lazyable.ts":
/*!******************************!*\
  !*** ./src/lazy/Lazyable.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LAZYABLE_FLAG": () => (/* binding */ LAZYABLE_FLAG),
/* harmony export */   "LAZYABLED_FLAG": () => (/* binding */ LAZYABLED_FLAG),
/* harmony export */   "ORIGIN_TARGET_FLAG": () => (/* binding */ ORIGIN_TARGET_FLAG),
/* harmony export */   "hasTargetLazyabled": () => (/* binding */ hasTargetLazyabled),
/* harmony export */   "isLazyabledData": () => (/* binding */ isLazyabledData),
/* harmony export */   "transformLazyable": () => (/* binding */ transformLazyable),
/* harmony export */   "Lazyable": () => (/* binding */ Lazyable),
/* harmony export */   "getLazyableRawData": () => (/* binding */ getLazyableRawData),
/* harmony export */   "Raw": () => (/* binding */ Raw),
/* harmony export */   "Ref": () => (/* binding */ Ref),
/* harmony export */   "onLazyable": () => (/* binding */ onLazyable),
/* harmony export */   "State": () => (/* binding */ State)
/* harmony export */ });
/**是否是代理对象 */
var LAZYABLE_FLAG = Symbol("_$$__$$__is_lazyable");
/**是否是一个已经proxy */

var LAZYABLED_FLAG = Symbol("_$$__$$__is_lazyabled");
/** 代理对象的原生对象属性标识 */

var ORIGIN_TARGET_FLAG = Symbol("_$$__$$__origin_target_flag");

/**
 * 判断一个对象是否已经被代理过
 * @param value
 * @returns
 */
function hasTargetLazyabled(value) {
  if (!value || typeof value !== "object") return false;
  var origin = getLazyableRawData(value);
  var proto = origin === null || origin === void 0 ? void 0 : origin.__proto__;
  if (!proto || !proto[LAZYABLE_FLAG]) return false;
  return true;
}
function isLazyabledData(v) {
  return v && v[LAZYABLED_FLAG];
}
/**
 * 代理一个对象让它变得可以被监听
 * @param value 需要被监听的值
 */

function canKeyLazyable(k, {
  include,
  exclude
} = {}) {
  if (exclude && exclude.includes(k)) return false;

  if (include) {
    return include.includes(k);
  }

  return true;
}

var GET_HANDLERS_MAP = new Map();
var SET_HANDLERS_MAP = new Map();
var DELETE_HANDLERS_MAP = new Map();
var ADD_HANDLERS_MAP = new Map();

function getHandlersMapByType(type) {
  switch (type) {
    case "get":
      return GET_HANDLERS_MAP;

    case "set":
      return SET_HANDLERS_MAP;

    case "delete":
      return DELETE_HANDLERS_MAP;

    case "add":
      return ADD_HANDLERS_MAP;
  }
}

function onLazyableOpt(map, t = "default", ...args) {
  var _map$get;

  (_map$get = map.get(Raw(t))) === null || _map$get === void 0 ? void 0 : _map$get.forEach(h => h(...args));
}

var LAZYABLE_GET_TRANSFORMERS = []; // 转换获取值的逻辑

function transformLazyable(h) {
  LAZYABLE_GET_TRANSFORMERS.push(h);
}
function Lazyable(value, opt = {}) {
  var _getLazyableRawData;

  if (!value) return value;
  if (typeof value !== "object") return value;
  if (hasTargetLazyabled(value)) return (_getLazyableRawData = getLazyableRawData(value)) === null || _getLazyableRawData === void 0 ? void 0 : _getLazyableRawData[LAZYABLE_FLAG];
  var R = new Proxy(value, {
    get(t, k, r) {
      var _getLazyableRawData2;

      if (k === ORIGIN_TARGET_FLAG) return t;
      if (k === LAZYABLED_FLAG) return true;
      var v = Reflect.get(t, k, r);

      if (!canKeyLazyable(k, opt)) {
        return v;
      }

      var Rv = hasTargetLazyabled(v) ? (_getLazyableRawData2 = getLazyableRawData(v)) === null || _getLazyableRawData2 === void 0 ? void 0 : _getLazyableRawData2[LAZYABLE_FLAG] // 已经是代理对象了 获取这个对象存储的代理结果
      : (v === null || v === void 0 ? void 0 : v.__proto__) === [].__proto__ || (v === null || v === void 0 ? void 0 : v.__proto__) === {}.__proto__ // 是一个普通的对象而非一个类
      ? Lazyable(v) // 响应化
      : v;
      onLazyableOpt(GET_HANDLERS_MAP, t, t, k, Rv);
      onLazyableOpt(GET_HANDLERS_MAP, "default", t, k, Rv);
      return LAZYABLE_GET_TRANSFORMERS.reduce((lastv, h) => h(lastv, t, k, R), Rv);
    },

    set(t, k, v, r) {
      var isAdd = !t.hasOwnProperty(k);
      var oldValue = Reflect.get(t, k); // 将原生的值放进去

      var res = Reflect.set(t, k, getLazyableRawData(v), r);
      onLazyableOpt(SET_HANDLERS_MAP, t, t, k, v, oldValue, isAdd);
      onLazyableOpt(SET_HANDLERS_MAP, "default", t, k, v, oldValue, isAdd);

      if (isAdd) {
        onLazyableOpt(ADD_HANDLERS_MAP, t, t, k, v, oldValue, isAdd);
        onLazyableOpt(ADD_HANDLERS_MAP, "default", t, k, v, oldValue, isAdd);
      }

      return res;
    },

    deleteProperty(t, p) {
      var oldValue = Reflect.get(t, p);
      var res = Reflect.deleteProperty(t, p);
      onLazyableOpt(DELETE_HANDLERS_MAP, t, t, p, oldValue);
      onLazyableOpt(DELETE_HANDLERS_MAP, "default", t, p, oldValue);
      return res;
    }

  }); // 在原生对象中记录这个代理对象 保证所有的原生对象其实指向同一个代理对象 是否有必要 有待实践

  value.__proto__ = new Proxy(Array.isArray(value) ? [] : {}, {
    get(t, k, v) {
      if (k === LAZYABLE_FLAG) return R;
      return Reflect.get(t, k, v);
    }

  });
  return R;
}
/**
 * 获取一个被代理过的对象的原始数据
 * @param value
 * @returns
 */

function getLazyableRawData(value) {
  return (value === null || value === void 0 ? void 0 : value[ORIGIN_TARGET_FLAG]) || value;
}
var Raw = getLazyableRawData;
/**
 * 让一个值变得可被代理
 * @param value
 */

function Ref(value) {
  return Lazyable({
    value
  });
}
function onLazyable(type, t, h) {
  var _map$get2;

  if (!h) {
    var temp = t;
    t = "default";
    h = temp;
  } else {
    t = Raw(t);
  }

  var map = getHandlersMapByType(type);
  if (!map) return () => {};

  if (!map.has(t)) {
    map.set(t, new Set());
  }

  (_map$get2 = map.get(t)) === null || _map$get2 === void 0 ? void 0 : _map$get2.add(h);
  return () => {
    var _map$get3, _map$get4;

    (_map$get3 = map.get(t)) === null || _map$get3 === void 0 ? void 0 : _map$get3.delete(h);
    if (((_map$get4 = map.get(t)) === null || _map$get4 === void 0 ? void 0 : _map$get4.size) === 0) map.delete(t);
  };
}
function State() {
  return (target, property) => {
    // 获取描述符
    var value = target[property];
    /**
     * 当用户设置属性的时候 就相当于在设置temp的属性
     * 获取属性的时候 获取的也是temp的属性
     * 因此在记录的时候就能够自动的去发送事件而不用自己单独的去
     */

    var temp = Lazyable({
      [property]: value
    });
    Object.defineProperty(target, property, {
      get() {
        return temp[property];
      },

      set(v) {
        temp[property] = v;
      }

    });
  };
}

/***/ }),

/***/ "./src/lazy/VirtualElement.ts":
/*!************************************!*\
  !*** ./src/lazy/VirtualElement.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VirtualElement),
/* harmony export */   "formatResult": () => (/* binding */ formatResult),
/* harmony export */   "renderResult": () => (/* binding */ renderResult),
/* harmony export */   "getElements": () => (/* binding */ getElements),
/* harmony export */   "unmountResult": () => (/* binding */ unmountResult),
/* harmony export */   "useLazyable": () => (/* binding */ useLazyable),
/* harmony export */   "useCreated": () => (/* binding */ useCreated),
/* harmony export */   "useUnMounted": () => (/* binding */ useUnMounted),
/* harmony export */   "useMounted": () => (/* binding */ useMounted),
/* harmony export */   "diffResult": () => (/* binding */ diffResult)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/lazy/Component.ts");
/* harmony import */ var _Document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Document */ "./src/lazy/Document.ts");
/* harmony import */ var _Lazyable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Lazyable */ "./src/lazy/Lazyable.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/lazy/utils/index.ts");
/* harmony import */ var _LazyTask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LazyTask */ "./src/lazy/LazyTask.ts");
/* harmony import */ var _LazyProp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LazyProp */ "./src/lazy/LazyProp.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var FunctionalComponentIndex = 0;
var TempRunningFunctionalComponent = 0;
var FunctionalComponentStoreMap = new Map();
class VirtualElement {
  getKey() {
    return (0,_LazyTask__WEBPACK_IMPORTED_MODULE_4__.runExcludeTask)(() => {
      var _this$key;

      return (_this$key = this.key) === null || _this$key === void 0 ? void 0 : _this$key.call(this);
    });
  }

  constructor(id, key, component, props, children) {
    this.id = id;
    this.key = key;
    this.component = component;
    this.props = props;
    this.children = children;

    _defineProperty(this, "result", void 0);

    _defineProperty(this, "mainTask", void 0);

    _defineProperty(this, "isComponent", false);

    _defineProperty(this, "isFunction", false);

    _defineProperty(this, "isFragment", false);

    _defineProperty(this, "isNative", false);

    _defineProperty(this, "native", void 0);

    _defineProperty(this, "Prop", void 0);

    _defineProperty(this, "instance", void 0);
  }

  execComponent() {
    this.mainTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o1 => {
      // instance 要在prop之前 因为prop中要处理ref
      var unmount = [];
      o1.except(() => {
        var _this$instance$onCrea, _this$instance;

        this.instance = new this.component();
        this.Prop = new _LazyProp__WEBPACK_IMPORTED_MODULE_5__.LazyProp(this);
        this.instance._prop = this.Prop.getProp();
        var r = (_this$instance$onCrea = (_this$instance = this.instance).onCreated) === null || _this$instance$onCrea === void 0 ? void 0 : _this$instance$onCrea.call(_this$instance);

        if (r && typeof r === "function") {
          unmount.push(r);
        }
      });
      var renderTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o2 => {
        var _this$instance2;

        var result = (_this$instance2 = this.instance) === null || _this$instance2 === void 0 ? void 0 : _this$instance2.render(); // 第一次运行 直接赋值

        if (o2.runTime === 1) {
          var _this$instance3;

          var fr = formatResult(result); // 别忘了要执行以下

          o1.setData(renderResult(fr));
          var r = (_this$instance3 = this.instance) === null || _this$instance3 === void 0 ? void 0 : _this$instance3.onMounted();

          if (r && typeof r === "function") {
            unmount.push(r);
          }

          this.result = fr;
        } else {
          // 非第一次，要比较 并返回最新结果
          var {
            result: Res,
            elements
          } = diffResult(formatResult(result), this.result);
          this.result = Res;

          if (elements && elements.length > 0) {
            o1.setData(elements);
          }
        }
      }, {
        debounce: 10
      });
      return () => {
        var _this$Prop, _this$instance4;

        // 停止属性的监听
        (_this$Prop = this.Prop) === null || _this$Prop === void 0 ? void 0 : _this$Prop.stop(); // 停止渲染任务

        renderTask.stop();
        (_this$instance4 = this.instance) === null || _this$instance4 === void 0 ? void 0 : _this$instance4.onUnMounted();
        unmount.forEach(r => r());
      };
    }, {
      maxRunTime: 1
    });
    return this.mainTask.getData() || [];
  }

  execFunctional() {
    this.mainTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o1 => {
      var _this$Prop2;

      this.Prop = new _LazyProp__WEBPACK_IMPORTED_MODULE_5__.LazyProp(this); // 设置当前函数组件的一个唯一ID

      var ThisFunctionalIndex = ++FunctionalComponentIndex;
      var prop = (_this$Prop2 = this.Prop) === null || _this$Prop2 === void 0 ? void 0 : _this$Prop2.getProp();
      var renderTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o2 => {
        // 执行函数 支持hooks基础功能
        var result = execFunctionalComponent(ThisFunctionalIndex, () => this.component(prop));

        if (o2.runTime === 1) {
          var fr = formatResult(result);
          o1.setData(renderResult(fr));
          this.result = fr;
          var data = FunctionalComponentStoreMap.get(ThisFunctionalIndex);

          if (data) {
            data.mounted.forEach(u => u());
          }
        } else {
          var {
            result: Res,
            elements
          } = diffResult(formatResult(result), this.result);
          this.result = Res;

          if (elements && elements.length > 0) {
            o1.setData(elements);
          }
        }

        return () => {
          var data = FunctionalComponentStoreMap.get(ThisFunctionalIndex);
          data === null || data === void 0 ? void 0 : data.unmount.forEach(u => u());
          FunctionalComponentStoreMap.delete(ThisFunctionalIndex);
        };
      }, {
        debounce: 10
      });
      return () => {
        var _this$Prop3;

        (_this$Prop3 = this.Prop) === null || _this$Prop3 === void 0 ? void 0 : _this$Prop3.stop();
        renderTask.stop();
      };
    }, {
      maxRunTime: 1
    });
    return this.mainTask.getData() || [];
  }

  execFragment() {
    this.mainTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o1 => {
      // 这是被处理过的fragment
      this.Prop = new _LazyProp__WEBPACK_IMPORTED_MODULE_5__.LazyProp(this);
      var prop = this.Prop.getProp();
      o1.addSubTask(new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o2 => {
        if (typeof this.id === "string") {
          var _children = prop.children || [];

          if (_children.length <= 0) throw new Error("formatted fragment can not be Empty");
          var h = _children[0];
          var res = h();
          var fr = formatResult(res);

          if (o2.runTime === 1) {
            o1.setData(renderResult(fr));
            this.result = fr;
          } else {
            var {
              result: Res,
              elements
            } = diffResult(fr, this.result);
            this.result = Res;

            if (elements && elements.length > 0) {
              o1.setData(elements);
            }
          }
        } else {
          if (o2.runTime === 1) {
            var _children2 = prop.children;
            o1.setData((0,_utils__WEBPACK_IMPORTED_MODULE_3__.flattern)(_children2.map(i => renderResult(i))));
            this.result = _children2;
          } else {
            var {
              result
            } = diffResult(prop.children, this.result);
            this.result = result;
          }
        }
      }, {
        debounce: true
      } // DEBOUNCE必不可少 否则数组变化时可能出现问题
      ));
    }, {
      maxRunTime: 1
    });
    return this.mainTask.getData() || [];
  }

  execNative() {
    this.mainTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o1 => {
      var component = this.component;
      this.native = _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.createElement(component);
      this.Prop = new _LazyProp__WEBPACK_IMPORTED_MODULE_5__.LazyProp(this);
      o1.setData([this.native]);
      var prop = this.Prop.getProp();
      var rawProp = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.Raw)(prop);

      var handle = (p, cb) => {
        if (p === "children") {
          // children的需要特殊处理
          return new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o3 => {
            if (rawProp.hasOwnProperty(p)) {
              if (o3.runTime === 1) {
                var _prop$children, _this$native;

                // 第一次运行 执行结果
                var elemets = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.flattern)((_prop$children = prop.children) === null || _prop$children === void 0 ? void 0 : _prop$children.map(i => renderResult(i)), 1);
                this.result = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.Raw)(prop.children); // 将结果添加到dom中

                (_this$native = this.native) === null || _this$native === void 0 ? void 0 : _this$native.append(elemets); // 存储下旧的值
              } else {
                var {
                  result
                } = diffResult(prop.children, this.result);
                this.result = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.Raw)(result); // o3.setData(diffResult(prop.children, o3.getData()).result);
              }
            } else {
              // children没了  要卸载掉
              unmountResult(this.result || []);
              this.result = undefined;
              cb(o3.getTask());
            }
          }, {
            debounce: 10
          });
        } else {
          // 正常的属性
          return new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o3 => {
            // 对于children要做特殊心理
            if (rawProp.hasOwnProperty(p)) {
              var newV = prop[p];
              var oldV = o3.getData();

              if (newV !== oldV) {
                var _this$native2, _this$native3;

                (_this$native2 = this.native) === null || _this$native2 === void 0 ? void 0 : _this$native2.removeAttribute(p, oldV);
                o3.setData(newV); // 设置属性

                (_this$native3 = this.native) === null || _this$native3 === void 0 ? void 0 : _this$native3.setAttribute(p, prop[p]);
              }
            } else {
              // 移除属性
              cb(o3.getTask());
            }

            return isStop => {
              var _this$native4;

              return isStop && ((_this$native4 = this.native) === null || _this$native4 === void 0 ? void 0 : _this$native4.removeAttribute(p, o3.getData()));
            };
          });
        }
      };

      var renderTask = new _LazyTask__WEBPACK_IMPORTED_MODULE_4__.LazyTask(o2 => {
        // 处理所有的属性 同时要注意新增属性的情况
        var unsub = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.onLazyable)("add", prop, (t, k) => {
          o2.addSubTask(handle(k, t => o2.removeSubTask(t, true)));
        });

        for (var i in prop) {
          o2.addSubTask(handle(i, t => o2.removeSubTask(t, true)));
        }

        return () => {
          // 停止所有的任务
          unsub();
        };
      });
      return () => {
        var _this$Prop4;

        (_this$Prop4 = this.Prop) === null || _this$Prop4 === void 0 ? void 0 : _this$Prop4.stop();
        renderTask.stop();
      };
    }, {
      maxRunTime: 1
    });
    return this.mainTask.getData() || [];
  }

  stop() {
    var _this$mainTask;

    (_this$mainTask = this.mainTask) === null || _this$mainTask === void 0 ? void 0 : _this$mainTask.stop();
    this.mainTask = undefined;
  }

  exec() {
    if (this.component && this.component[_Component__WEBPACK_IMPORTED_MODULE_0__.COMPONENT_FLAG]) {
      this.isComponent = true;
      return this.execComponent();
    } else if (typeof this.component === "function") {
      this.isFunction = true;
      return this.execFunctional();
    } else if (this.component === "fragment") {
      this.isFragment = true;
      return this.execFragment();
    } else if (typeof this.component === "string") {
      this.isNative = true;
      return this.execNative();
    }

    return [];
  }

  getElements() {
    return getElements(formatResult(this.result));
  }

  unmount() {
    // 先停止任务
    this.stop();

    if (this.isNative) {
      var _this$native5;

      var position = _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.getPosition([this.native]);
      (_this$native5 = this.native) === null || _this$native5 === void 0 ? void 0 : _this$native5.remove();
      return position;
    } else {
      return this.result && unmountResult(this.result);
    }
  }

}
/**
 * 格式化返回结果
 * @param result
 * @returns
 */

function formatResult(result) {
  if (Array.isArray(result) && result.length > 0) {
    return result.map(i => formatResult(i));
  } else if (_Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.isTextElement(result)) {
    return result;
  } else if (result instanceof VirtualElement) {
    return result;
  } else if (typeof result === "function") {
    return formatResult(result());
  }

  return _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.createTextElement(JSON.stringify(result));
}
/**
 * 对于返回的结果进行解析
 * @param result
 * @returns
 */

function renderResult(_result) {
  var result = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.Raw)(_result);

  if (Array.isArray(result)) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.flattern)(result.map(i => renderResult(i)), 1);
  } else if (result instanceof VirtualElement) {
    return result.exec();
  }

  return [result];
}
/**
 * 获取格式化后的节点数据
 * @param result
 * @param exec
 * @returns
 */

function getElements(result) {
  if (Array.isArray(result)) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.flattern)(result.map(i => getElements(i)), -1);
  } else if (result instanceof VirtualElement) {
    if (result.isNative) return [result.native];
    return result.getElements();
  }

  return [result];
}
function unmountResult(result) {
  if (Array.isArray(result)) {
    var positions = result.map(r => unmountResult(r));
    return positions[positions.length - 1];
  } else if (result instanceof VirtualElement) {
    return result.unmount();
  } else {
    var position = _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.getPosition([result]);
    result.remove();
    return position;
  }
}
/**
 * 执行函数组件时所作的操作
 * execFunctionalComponent(1, () => SomeCom(prop))
 * @param func
 */

function execFunctionalComponent(index, func) {
  // 初始化函数组件的数据
  var lastRunningComponent = TempRunningFunctionalComponent;
  TempRunningFunctionalComponent = index;

  if (!FunctionalComponentStoreMap.has(TempRunningFunctionalComponent)) {
    FunctionalComponentStoreMap.set(TempRunningFunctionalComponent, {
      lazyableData: [],
      inited: false,
      lazyableDataIndex: 0,
      unmount: [],
      mounted: []
    });
  } // 执行


  var result = func();
  var data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent);

  if (!data.inited) {
    data.inited = true;
  }

  data.lazyableDataIndex = 0; // 重置下标

  TempRunningFunctionalComponent = lastRunningComponent;
  return result;
}

function assertInFunctionComponent() {
  if (!TempRunningFunctionalComponent) throw new Error("useLazyable only support functional component!");
} // 使用响应值


function useLazyable(initialValue) {
  assertInFunctionComponent();
  var data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent);
  var returnValue;

  if (data.inited) {
    returnValue = data.lazyableData[data.lazyableDataIndex];
    data.lazyableDataIndex++;
  } else {
    returnValue = (0,_Lazyable__WEBPACK_IMPORTED_MODULE_2__.Lazyable)(initialValue);
    data.lazyableData.push(returnValue);
  }

  return returnValue;
} // 使用初始化钩子

function useCreated(func) {
  assertInFunctionComponent();
  var data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent);

  if (!data.inited) {
    var result = func();

    if (result && typeof result === "function") {
      data.unmount.push(result);
    }
  }
} // 下载时使用的函数

function useUnMounted(func) {
  assertInFunctionComponent();
  var data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent);

  if (!data.inited) {
    data.unmount.push(func);
  }
}
function useMounted(func) {
  assertInFunctionComponent();
  var data = FunctionalComponentStoreMap.get(TempRunningFunctionalComponent);

  if (!data.inited) {
    data.mounted.push(() => {
      var res = func();
      if (res && typeof res === "function") data.unmount.push(res);
    });
  }
}
/**
 * @todo
 * @param newResult
 * @param oldResult
 * @returns
 */

function diffResult(newResult, oldResult) {
  // 都是虚拟DOM 看类型是否一样
  if (newResult instanceof VirtualElement && oldResult instanceof VirtualElement && newResult.component === oldResult.component) {
    var _oldResult$Prop;

    (_oldResult$Prop = oldResult.Prop) === null || _oldResult$Prop === void 0 ? void 0 : _oldResult$Prop.update(newResult.id, newResult.props, newResult.children);
    return {
      result: oldResult
    };
  } else if (Array.isArray(newResult) && Array.isArray(oldResult)) {
    var _nextElement;

    var oldKeymap = new Map();
    var oldRestIndexes = new Set();
    var usedOldIndex = new Set();
    oldResult.forEach((r, index) => {
      if (r instanceof VirtualElement) {
        var _oldKeymap$get;

        var _key = r.getKey();

        if (!oldKeymap.has(r.component) || !((_oldKeymap$get = oldKeymap.get(r.component)) !== null && _oldKeymap$get !== void 0 && _oldKeymap$get.has(_key))) {
          var _oldKeymap$get2;

          if (!oldKeymap.has(r.component)) {
            oldKeymap.set(r.component, new Map());
          }

          if (!((_oldKeymap$get2 = oldKeymap.get(r.component)) !== null && _oldKeymap$get2 !== void 0 && _oldKeymap$get2.has(_key))) {
            var _oldKeymap$get3;

            (_oldKeymap$get3 = oldKeymap.get(r.component)) === null || _oldKeymap$get3 === void 0 ? void 0 : _oldKeymap$get3.set(_key, index);
          }

          return;
        }
      }

      oldRestIndexes.add(index);
    }); // 先获取第一个元素

    var positionIndex = 0;
    var elements = getElements(oldResult[positionIndex]);
    var nextElement = elements[0];
    var parent = (_nextElement = nextElement) === null || _nextElement === void 0 ? void 0 : _nextElement.parent;
    var newReturnResult = [];
    var returnElements = [];

    for (var i = 0; i < newResult.length; i++) {
      var _parent;

      var r = newResult[i];

      if (r instanceof VirtualElement) {
        var _key2 = r.getKey(); // 存在key 之所以单独把key在这里 是为了使用key变量 避免不必要的函数计算


        if (_key2 !== undefined && _key2 !== null) {
          var _oldKeymap$get4;

          var _component = r.component; // component 和 key都必须相同 否则就是替换

          if (oldKeymap.has(_component) && (_oldKeymap$get4 = oldKeymap.get(_component)) !== null && _oldKeymap$get4 !== void 0 && _oldKeymap$get4.has(_key2)) {
            var _oldKeymap$get5, _or$Prop;

            // 在旧的结果中存在这个值
            var oldPosition = (_oldKeymap$get5 = oldKeymap.get(_component)) === null || _oldKeymap$get5 === void 0 ? void 0 : _oldKeymap$get5.get(_key2); // 删除 防止之后又重复的key

            var keys = oldKeymap.get(_component);
            keys === null || keys === void 0 ? void 0 : keys.delete(_key2);

            if ((keys === null || keys === void 0 ? void 0 : keys.size) === 0) {
              oldKeymap.delete(_component);
            }

            usedOldIndex.add(oldPosition);
            var or = oldResult[oldPosition];
            (_or$Prop = or.Prop) === null || _or$Prop === void 0 ? void 0 : _or$Prop.update(r.id, r.props, r.children);
            newReturnResult.push(or);
            var newElements = or.getElements();
            returnElements.push(newElements); // 老结果的位置就是当前nextElement所在的那个index的位置  那就更新老结果

            if (oldPosition === positionIndex) {
              while (positionIndex < oldResult.length) {
                positionIndex++;

                if (positionIndex >= oldResult.length) {
                  var _nextElement2;

                  nextElement = elements[elements.length - 1].nextSibling;
                  parent = ((_nextElement2 = nextElement) === null || _nextElement2 === void 0 ? void 0 : _nextElement2.parent) || null;
                } else if (!usedOldIndex.has(positionIndex)) {
                  // 这个位置的元素可能已经被用过了 要忽略
                  // 如果这个位置没被用过 那就要用起来
                  elements = getElements(oldResult[positionIndex]);
                  nextElement = elements[0];
                  parent = nextElement.parent; // 跳出循环

                  break;
                }
              }
            } else {
              var _nextElement3;

              // 在老结果中有对应的元素   不管在哪里 他肯定要移到nextElement前面
              // newElements.forEach((r) => r.remove());
              _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.insertElements(newElements, {
                parent,
                nextSibling: nextElement,
                preSibling: ((_nextElement3 = nextElement) === null || _nextElement3 === void 0 ? void 0 : _nextElement3.preSibling) || null
              });
            }

            continue;
          }
        }
      } // 渲染结果  获得DOM


      var tempElements = renderResult(r); // 保存结果

      returnElements.push(tempElements); // 插入DOM

      (_parent = parent) === null || _parent === void 0 ? void 0 : _parent.insertBefore(tempElements, nextElement); // 存储结果

      newReturnResult.push(r);
    } // 别忘了把没用到的数据给删了


    oldRestIndexes.forEach(i => unmountResult(oldResult[i]));
    oldKeymap.forEach(map => map.forEach(i => unmountResult(oldResult[i])));
    return {
      result: newReturnResult,
      elements: (0,_utils__WEBPACK_IMPORTED_MODULE_3__.flattern)(returnElements)
    };
    /**
     * 数组DIFF操作的逻辑
     * 1. component + key相同才能算同一种类型
     * 2. 其他的都不算 该删的删
     */
  } else if (_Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.isTextElement(newResult) && _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.isTextElement(oldResult) && newResult.getText() === oldResult.getText()) {
    return {
      result: oldResult
    };
  }

  var position = unmountResult(oldResult);
  if (!position) throw new Error("Old Virtual Element is Error!");
  var doms = renderResult(newResult);
  _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument.insertElements(doms, position);
  return {
    result: newResult,
    elements: doms
  };
}

/***/ }),

/***/ "./src/lazy/common.ts":
/*!****************************!*\
  !*** ./src/lazy/common.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./src/lazy/index.ts":
/*!***************************!*\
  !*** ./src/lazy/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArgsData": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.ArgsData),
/* harmony export */   "Debounce": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.Debounce),
/* harmony export */   "EventEmitter": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.EventEmitter),
/* harmony export */   "IdGenerator": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.IdGenerator),
/* harmony export */   "Throttle": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.Throttle),
/* harmony export */   "XPromise": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.XPromise),
/* harmony export */   "autobind": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.autobind),
/* harmony export */   "chunk": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.chunk),
/* harmony export */   "debounce": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.debounce),
/* harmony export */   "equal": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.equal),
/* harmony export */   "findArrayDiff": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.findArrayDiff),
/* harmony export */   "flattern": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.flattern),
/* harmony export */   "generateArray": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.generateArray),
/* harmony export */   "generateTreeByArray": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.generateTreeByArray),
/* harmony export */   "get": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.get),
/* harmony export */   "isArray": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isArray),
/* harmony export */   "isBoolean": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isBoolean),
/* harmony export */   "isEmpty": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isEmpty),
/* harmony export */   "isEmptyString": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isEmptyString),
/* harmony export */   "isMap": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isMap),
/* harmony export */   "isNil": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isNil),
/* harmony export */   "isNull": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isNull),
/* harmony export */   "isNumber": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isNumber),
/* harmony export */   "isObject": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isObject),
/* harmony export */   "isSet": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isSet),
/* harmony export */   "isString": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isString),
/* harmony export */   "isSymbol": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isSymbol),
/* harmony export */   "isUndefined": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isUndefined),
/* harmony export */   "joinObject": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.joinObject),
/* harmony export */   "lazy": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.lazy),
/* harmony export */   "loading": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.loading),
/* harmony export */   "mergeArray": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.mergeArray),
/* harmony export */   "omit": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.omit),
/* harmony export */   "pendding": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.pendding),
/* harmony export */   "pick": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.pick),
/* harmony export */   "set": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.set),
/* harmony export */   "throttle": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.throttle),
/* harmony export */   "toMap": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.toMap),
/* harmony export */   "waitTime": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.waitTime),
/* harmony export */   "LazyDocument": () => (/* reexport safe */ _Document__WEBPACK_IMPORTED_MODULE_1__.LazyDocument),
/* harmony export */   "lazyDocument": () => (/* reexport safe */ _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument),
/* harmony export */   "COMPONENT_FLAG": () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_5__.COMPONENT_FLAG),
/* harmony export */   "Component": () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_5__.Component),
/* harmony export */   "LAZYABLED_FLAG": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.LAZYABLED_FLAG),
/* harmony export */   "LAZYABLE_FLAG": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.LAZYABLE_FLAG),
/* harmony export */   "Lazyable": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.Lazyable),
/* harmony export */   "ORIGIN_TARGET_FLAG": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.ORIGIN_TARGET_FLAG),
/* harmony export */   "Raw": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.Raw),
/* harmony export */   "Ref": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.Ref),
/* harmony export */   "State": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.State),
/* harmony export */   "getLazyableRawData": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.getLazyableRawData),
/* harmony export */   "hasTargetLazyabled": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.hasTargetLazyabled),
/* harmony export */   "isLazyabledData": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.isLazyabledData),
/* harmony export */   "onLazyable": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.onLazyable),
/* harmony export */   "transformLazyable": () => (/* reexport safe */ _Lazyable__WEBPACK_IMPORTED_MODULE_6__.transformLazyable),
/* harmony export */   "LazyTask": () => (/* reexport safe */ _LazyTask__WEBPACK_IMPORTED_MODULE_7__.LazyTask),
/* harmony export */   "getRunningTask": () => (/* reexport safe */ _LazyTask__WEBPACK_IMPORTED_MODULE_7__.getRunningTask),
/* harmony export */   "runExcludeTask": () => (/* reexport safe */ _LazyTask__WEBPACK_IMPORTED_MODULE_7__.runExcludeTask),
/* harmony export */   "diffResult": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.diffResult),
/* harmony export */   "formatResult": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.formatResult),
/* harmony export */   "getElements": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.getElements),
/* harmony export */   "renderResult": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.renderResult),
/* harmony export */   "unmountResult": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.unmountResult),
/* harmony export */   "useCreated": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.useCreated),
/* harmony export */   "useLazyable": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.useLazyable),
/* harmony export */   "useMounted": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.useMounted),
/* harmony export */   "useUnMounted": () => (/* reexport safe */ _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.useUnMounted),
/* harmony export */   "Lazyman": () => (/* binding */ Lazyman)
/* harmony export */ });
/* harmony import */ var _VirtualElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VirtualElement */ "./src/lazy/VirtualElement.ts");
/* harmony import */ var _Document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Document */ "./src/lazy/Document.ts");
/* harmony import */ var _LazyDom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LazyDom */ "./src/lazy/LazyDom.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/lazy/utils/index.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common */ "./src/lazy/common.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Component */ "./src/lazy/Component.ts");
/* harmony import */ var _Lazyable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Lazyable */ "./src/lazy/Lazyable.ts");
/* harmony import */ var _LazyTask__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LazyTask */ "./src/lazy/LazyTask.ts");












var Lazyman = {
  createElement(id, key, component, props, children) {
    return new _VirtualElement__WEBPACK_IMPORTED_MODULE_0__.default(id, key, component, props, children);
  },

  document: _Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument,

  // 加载驱动
  drive(d = _LazyDom__WEBPACK_IMPORTED_MODULE_2__.default) {
    Object.assign(_Document__WEBPACK_IMPORTED_MODULE_1__.lazyDocument, d);
  },

  render(ele, container) {
    if (!container) throw new Error("container is Emptry");
    var format = (0,_VirtualElement__WEBPACK_IMPORTED_MODULE_0__.formatResult)(ele);
    container.append((0,_VirtualElement__WEBPACK_IMPORTED_MODULE_0__.renderResult)(format));
  }

};
/* harmony default export */ __webpack_exports__["default"] = (Lazyman);
window.Lazyman = Lazyman;


/***/ }),

/***/ "./src/lazy/utils/Args.ts":
/*!********************************!*\
  !*** ./src/lazy/utils/Args.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CacheArgs),
/* harmony export */   "ArgsData": () => (/* binding */ ArgsData)
/* harmony export */ });
/* harmony import */ var _Object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Object */ "./src/lazy/utils/Object.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/**
 * 用来判断参数是否一致的类
 * timeout 超时时间
 */

class CacheArgs {
  constructor(timeout = 1000, level = 1) {
    this.timeout = timeout;
    this.level = level;

    _defineProperty(this, "argsDataList", []);
  }
  /**
   * 添加新的参数
   * 若返回true 表示这个参数已存在
   * 若返回false 表示这个参数已经不存在
   * @param args 传入的args
   * @returns ArgsData
   */


  getArgs(args = []) {
    return this.argsDataList.find(data => data.isSame(args, this.level));
  }
  /**
   * 添加新的args
   * @param args
   * @returns
   */


  addArgs(args = [], onTimeout) {
    var old = this.getArgs(args);

    if (old) {
      return old;
    }

    var newData = new ArgsData(args, this);
    this.argsDataList.push(newData);

    if (this.timeout >= 0) {
      setTimeout(() => {
        var value = newData.getValue();
        this.remove(newData);
        newData.clear();
        onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout(value);
      }, this.timeout);
    }

    return newData;
  }

  remove(argsData) {
    this.argsDataList = this.argsDataList.filter(i => i !== argsData);
  }

}
class ArgsData {
  constructor(args = [], cache) {
    this.args = args;
    this.cache = cache;

    _defineProperty(this, "valueMap", new Map());
  }
  /**
   * 判断是否是相同的参数
   * @param args 传入的参数
   * @returns boolean
   */


  clear() {
    this.valueMap.clear();
  }

  isSame(args = [], level = 1) {
    return (0,_Object__WEBPACK_IMPORTED_MODULE_0__.equal)(args, this.args, level);
  }

  setValue(value, key = "default") {
    this.valueMap.set(key, value);
    return value;
  }

  getValue(key = "default") {
    return this.valueMap.get(key);
  }

}

/***/ }),

/***/ "./src/lazy/utils/Array.ts":
/*!*********************************!*\
  !*** ./src/lazy/utils/Array.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findArrayDiff": () => (/* binding */ findArrayDiff),
/* harmony export */   "generateArray": () => (/* binding */ generateArray),
/* harmony export */   "generateTreeByArray": () => (/* binding */ generateTreeByArray),
/* harmony export */   "toMap": () => (/* binding */ toMap),
/* harmony export */   "chunk": () => (/* binding */ chunk),
/* harmony export */   "flattern": () => (/* binding */ flattern),
/* harmony export */   "mergeArray": () => (/* binding */ mergeArray)
/* harmony export */ });
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./number */ "./src/lazy/utils/number.ts");


/**
 * 比较两个数组的异同
 * @param oData 对比的数组(旧的，基数)
 * @param nData 对比的数组
 * @param getValue 获取数组的key
 * @returns
 */
function findArrayDiff(oData, nData, getValue = v => v) {
  var oMap = new Map();
  oData.forEach(d => oMap.set(getValue(d), d));
  var result = {
    deleted: [],
    added: [],
    keep: []
  };
  nData.forEach(d => {
    var v = getValue(d);

    if (!oMap.has(v)) {
      result.added.push(d);
    } else {
      result.keep.push(d);
    }

    oMap.delete(v);
  });
  oMap.forEach(d => result.deleted.push(d));
  return result;
}
/**
 * 自动生成数组成
 * @param size 数组的大小
 * @param gene 生成数组的逻辑
 * @returns
 */

function generateArray(size, gene) {
  var arr = [];

  for (var _i = 0; _i < size; _i++) {
    arr.push(gene(_i));
  }

  return arr;
}
/**
 * 将一堆数组转换成有关系的树
 * @param nodes 所有的节点
 * @param param1 生成树的逻辑
 * @returns
 */

function generateTreeByArray(nodes, {
  id = "id",
  children = "children",
  parent = "parent_id"
}) {
  var res = [];
  var map = new Map();
  var cache = new Map();

  for (var _i2 in nodes) {
    var node = nodes[_i2]; // 这表示 之前有人用到我了

    if (cache.has(node[id])) {
      node[children] = cache.get(node[id]); // 可以删掉了 不需要了

      cache.delete(node[id]);
    } // 不存在父节点


    var parentId = node[parent];

    if (!parentId) {
      res.push(node);
    } else {
      // 存在父节点，我要找到它的父节点
      if (map.has(parentId)) {
        var parentNode = map.get(parentId);

        if (!parentNode[children]) {
          parentNode[children] = [];
        }

        parentNode[children].push(node);
      } else {
        var _cache$get;

        // 糟了，map里面还没有这个父节点，那么我存储下
        if (!cache.has(parentId)) {
          cache.set(parentId, []);
        } // 推进去


        (_cache$get = cache.get(parentId)) === null || _cache$get === void 0 ? void 0 : _cache$get.push(node);
      }
    }

    map.set(node[id], node);
  }

  return res;
}
/**
 * 将一个数组转换成一个map
 * @param arr 数组
 * @param getKey 每个item的key值获取逻辑
 * @returns
 */

function toMap(arr, getKey) {
  var map = new Map();
  arr.forEach(i => {
    var key = getKey(i);
    map.set(key, i);
  });
  return map;
}
/**
 * 讲一个数组以size为一组组成新的数组
 * @param arr 需要处理的函数
 * @param size 组的大小
 * @returns
 */

function chunk(arr, size) {
  var res = [];
  var temp = [];

  for (var _i3 = 0; _i3 < arr.length; _i3++) {
    var tail = _i3 % size;

    if (tail === 0) {
      temp = [];
      res.push(temp);
    }

    temp.push(arr[_i3]);
  }

  return res;
}
/**
 * 将一个复杂的嵌套着的数组展开
 * @param arr
 * @param level
 * @returns
 */

function flattern(arr, level = 1) {
  if (level === 0) return arr;
  var res = [];

  for (var _i4 = 0; _i4 < arr.length; _i4++) {
    var value = arr[_i4];

    if (Array.isArray(value)) {
      flattern(value, level - 1).forEach(t => res.push(t));
    } else {
      res.push(value);
    }
  }

  return res;
}
/**
 * 把a2的值 赋值给a1
 * 希望的是直接改变里面的内容
 * 1. a1比较长的话 需要把多出的元素删除
 * 2. a1比较短的话 需要新增元素
 * @param a1
 * @param a2
 * @returns
 */

function mergeArray(a1, a2) {
  var l1 = a1.length;
  var l2 = a2.length;
  var minL = (0,_number__WEBPACK_IMPORTED_MODULE_0__.min)(l1, l2);

  for (var _i5 = 0; _i5 < minL; _i5++) {
    a1[_i5] = a2[_i5];
  } // 说明a2小一点


  if (l1 > minL) {
    for (var _i6 = minL; _i6 < l1; _i6++) {
      a1.pop();
    }
  } // 说明a1小一点


  if (l2 > minL) {
    for (var _i7 = minL; _i7 < l2; _i7++) {
      a1.push(a2[_i7]);
    }
  }

  return a1;
}

/***/ }),

/***/ "./src/lazy/utils/Async.ts":
/*!*********************************!*\
  !*** ./src/lazy/utils/Async.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XPromise": () => (/* binding */ XPromise),
/* harmony export */   "Debounce": () => (/* binding */ Debounce),
/* harmony export */   "Throttle": () => (/* binding */ Throttle),
/* harmony export */   "waitTime": () => (/* binding */ waitTime)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-04-24 09:04:40
 * @modify date 2021-04-24 09:04:40
 * @desc [异步相关的处理]
 */
class XPromise {
  constructor() {
    _defineProperty(this, "promise", void 0);

    _defineProperty(this, "resolve", void 0);

    _defineProperty(this, "reject", void 0);

    this.init();
  }

  init() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = p => {
        resolve(p);
        return p;
      };

      this.reject = reject;
    });
  } // 外界调用表示结束


  wait() {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this.promise;
    })();
  }

}
/**
 * Debounce逻辑控制
 * Debounce是一个调用过来后，并不立即执行，而是要等待一段时间，这段时间内要是没有新的调用 则执行 若是有 则重新开始计时知道没有新的请求
 */

class Debounce {
  wait() {
    return this._async.wait();
  }

  constructor(timeout = 50) {
    this.timeout = timeout;

    _defineProperty(this, "_timeSchedule", null);

    _defineProperty(this, "_async", new XPromise());
  }

  execute(func) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      // 清空计时
      clearTimeout(_this2._timeSchedule); // 重新计时

      _this2._timeSchedule = setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
        var _this2$_async$resolve, _this2$_async2;

        // 到这里表示已经在触发处理函数了
        var promise = func(); // 当处理结束的时候 重新设置promise 开始新的周期

        _this2._async.wait().then(() => _this2._async = new XPromise());

        if (promise && promise.catch) {
          promise.catch(e => {
            var _this2$_async$reject, _this2$_async;

            return (_this2$_async$reject = (_this2$_async = _this2._async).reject) === null || _this2$_async$reject === void 0 ? void 0 : _this2$_async$reject.call(_this2$_async, e);
          });
        }

        (_this2$_async$resolve = (_this2$_async2 = _this2._async).resolve) === null || _this2$_async$resolve === void 0 ? void 0 : _this2$_async$resolve.call(_this2$_async2, yield promise);
      }), _this2.timeout);
      return _this2._async.wait();
    })();
  }

}
/**
 * Throttle 有新的任务过来的时候 执行，不过，会忽略接下来一段时间的请求 防止过于频繁的请求
 */

class Throttle {
  constructor(timeout = 50) {
    this.timeout = timeout;

    _defineProperty(this, "timeSchedule", null);

    _defineProperty(this, "result", void 0);

    _defineProperty(this, "_async", new XPromise());
  }

  wait() {
    return this._async.wait();
  } // 这个时间段内的请求直接忽略


  execute(func = () => {}) {
    if (this.timeSchedule) {
      return this.result;
    }

    this.timeSchedule = setTimeout(() => {
      var _this$_async$resolve, _this$_async;

      // 计时结束，这个周期结束
      this.timeSchedule = null; // 返回这个周期的值

      (_this$_async$resolve = (_this$_async = this._async).resolve) === null || _this$_async$resolve === void 0 ? void 0 : _this$_async$resolve.call(_this$_async, this.result); // 开启下一个周期

      this._async = new XPromise();
    }, this.timeout);
    this.result = func();
    return this.result;
  }

}
function waitTime(time = 0) {
  return new Promise(resolve => setTimeout(() => resolve(true), time));
}

/***/ }),

/***/ "./src/lazy/utils/Decorators.ts":
/*!**************************************!*\
  !*** ./src/lazy/utils/Decorators.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autobind": () => (/* binding */ autobind),
/* harmony export */   "pendding": () => (/* binding */ pendding),
/* harmony export */   "throttle": () => (/* binding */ throttle),
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "loading": () => (/* binding */ loading)
/* harmony export */ });
/* harmony import */ var _Async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Async */ "./src/lazy/utils/Async.ts");
/* harmony import */ var _Args__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Args */ "./src/lazy/utils/Args.ts");
/* harmony import */ var _Object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Object */ "./src/lazy/utils/Object.ts");



/**
 * @author [qianzhixiang]
 * @email [zxqian1991@163.com]
 * @create date 2019-12-12 10:04:00
 * @modify date 2019-12-12 10:04:00
 * @desc [自动绑定this]
 */

function autobind(target, key, {
  configurable,
  enumerable,
  set,
  value
}) {
  return {
    configurable,
    enumerable,
    // value, 这个值设置后不能设置get set
    set,

    get() {
      return value.bind(this);
    }

  };
}
function pendding() {
  return (target, property, descriptor) => {
    var map = new Map();
    var value = descriptor.value;

    descriptor.value = function () {
      var _promise$resolve;

      if (map.has(this)) {
        var _map$get;

        return (_map$get = map.get(this)) === null || _map$get === void 0 ? void 0 : _map$get.wait();
      }

      var promise = new _Async__WEBPACK_IMPORTED_MODULE_0__.XPromise();
      map.set(this, promise);
      promise.wait().then(() => map.delete(this));
      return (_promise$resolve = promise.resolve) === null || _promise$resolve === void 0 ? void 0 : _promise$resolve.call(promise, value.apply(this, arguments));
    };
  };
}
function throttle(timeout = 300) {
  return (target, property, descriptor) => {
    var value = descriptor.value;
    var map = new Map();

    descriptor.value = function () {
      if (map.has(this)) {
        var _map$get2;

        return (_map$get2 = map.get(this)) === null || _map$get2 === void 0 ? void 0 : _map$get2.wait();
      }

      var throttle = new _Async__WEBPACK_IMPORTED_MODULE_0__.Throttle(timeout);
      map.set(this, throttle);
      throttle.wait().then(() => map.delete(this));
      return throttle.execute(() => value.apply(this, arguments));
    };
  };
}
function debounce(timeout = 300) {
  return (target, property, descriptor) => {
    var value = descriptor.value;
    var map = new Map();

    descriptor.value = function () {
      if (map.has(this)) {
        var _map$get3;

        return (_map$get3 = map.get(this)) === null || _map$get3 === void 0 ? void 0 : _map$get3.wait();
      }

      var debounce = new _Async__WEBPACK_IMPORTED_MODULE_0__.Debounce(timeout);
      map.set(this, debounce);
      debounce.wait().then(() => map.delete(this));
      return debounce.execute(() => value.apply(this, arguments));
    };
  };
}
/**
 * K Lazy所在的类的实例类型
 * T Lazy的返回数据类型
 * @param timeout cache 保存的时间
 * @returns
 */

function lazy(timeout = 1000 * 60, {
  level = 1,
  onSet,
  onGet,
  onTimeout
} = {}) {
  return (target, property, descriptor) => {
    var value = descriptor.value;
    var cacheMap = new Map();

    descriptor.value = function (...args) {
      if (!cacheMap.has(this)) {
        cacheMap.set(this, new _Args__WEBPACK_IMPORTED_MODULE_1__.default(timeout, level));
      }

      var cache = cacheMap.get(this);
      var argsData = cache.getArgs(args);

      if (argsData) {
        // 有这个数据 直接读历史数据
        var _v = argsData.getValue();

        onGet === null || onGet === void 0 ? void 0 : onGet(_v, this);
        return _v;
      } // 没有 就缓存


      var newArgsData = cache.addArgs(args, v => onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout(v, this));
      var v = value.apply(this, args); // 设置新值

      newArgsData.setValue(v);
      onSet === null || onSet === void 0 ? void 0 : onSet(v, this);
      return newArgsData.getValue();
    };
  };
}
var countMap = new Map();
function loading({
  name = "loading",
  ins
} = {}) {
  return (target, property, descriptor) => {
    var value = descriptor.value;

    descriptor.value = function () {
      var _xp$resolve;

      var instance = ins || this;
      (0,_Object__WEBPACK_IMPORTED_MODULE_2__.set)(instance, name, true);
      countMap.set(instance, (countMap.get(instance) || 0) + 1);

      var _xp = new _Async__WEBPACK_IMPORTED_MODULE_0__.XPromise();

      _xp.wait().finally(() => {
        var count = countMap.get(instance) - 1;

        if (count === 0) {
          countMap.delete(instance);
          (0,_Object__WEBPACK_IMPORTED_MODULE_2__.set)(instance, name, false);
        } else {
          countMap.set(instance, count);
        }
      });

      (_xp$resolve = _xp.resolve) === null || _xp$resolve === void 0 ? void 0 : _xp$resolve.call(_xp, value.apply(this, arguments));
      return _xp.wait();
    };
  };
}

/***/ }),

/***/ "./src/lazy/utils/EventEmitter.ts":
/*!****************************************!*\
  !*** ./src/lazy/utils/EventEmitter.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IdGenerator": () => (/* binding */ IdGenerator),
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ID 生成器
class IdGenerator {
  constructor() {
    _defineProperty(this, "id", 0);

    _defineProperty(this, "id_can_used", []);
  }

  getId() {
    if (this.id_can_used.length > 0) return this.id_can_used.pop();
    return ++this.id;
  } // 释放ID


  releaseId(id) {
    if (this.id_can_used.length === id - 1) {
      id = 0;
      this.id_can_used = [];
    } else {
      this.id_can_used.push(id);
    }
  }

  clear() {
    this.id_can_used = [];
    this.id = 0;
  }

} // 事件处理

class EventEmitter {
  constructor() {
    _defineProperty(this, "$idG", new IdGenerator());

    _defineProperty(this, "eventMap", new Map());

    _defineProperty(this, "handlesMap", new Map());
  }

  unsubscribe(eventnames) {
    // 没有指定事件
    if (eventnames === undefined) {
      // this.eventMap.forEach((i, e) => this.unsubscribe(e));
      this.$idG.clear();
      this.eventMap.clear();
      this.handlesMap.clear();
      return;
    }

    if (!eventnames) {
      throw new Error("参数错误：必须指定需要取消监听的事件");
    }

    var type = typeof eventnames;

    if (type !== "string" && Array.isArray(eventnames)) {
      throw new Error("参数错误：必须是字符串或字符串数组");
    }

    if (type === "string") {
      var eventname = eventnames;
      var ids = this.eventMap.get(eventname);
      this.eventMap.delete(eventname);
      ids === null || ids === void 0 ? void 0 : ids.forEach(id => {
        this.$idG.releaseId(id);
        this.handlesMap.delete(id);
      });
      return;
    }

    eventnames.filter(e => e).forEach(eventname => this.unsubscribe(eventname));
  }

  on(eventname, handler) {
    if (!this.eventMap.has(eventname)) {
      this.eventMap.set(eventname, []);
    }

    var eventArr = this.eventMap.get(eventname);
    var eventId = this.$idG.getId();
    eventArr.push(eventId);
    this.handlesMap.set(eventId, handler);
    return () => {
      var arr = this.eventMap.get(eventname) || [];
      var res = arr.filter(id => id !== eventId);

      if (res.length === 0) {
        this.eventMap.delete(eventname);
      }

      this.handlesMap.delete(eventId);
      this.$idG.releaseId(eventId);
    };
  }

  emit(eventname, ...data) {
    var eventIds = this.eventMap.get(eventname) || [];
    eventIds.forEach(id => {
      var _this$handlesMap$get;

      return (_this$handlesMap$get = this.handlesMap.get(id)) === null || _this$handlesMap$get === void 0 ? void 0 : _this$handlesMap$get(...data);
    });
  }

  once(eventname, handler) {
    var unsubscribe = this.on(eventname, function (...args) {
      unsubscribe();
      return handler.apply(this, args);
    });
  }

}

/***/ }),

/***/ "./src/lazy/utils/Object.ts":
/*!**********************************!*\
  !*** ./src/lazy/utils/Object.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "equal": () => (/* binding */ equal),
/* harmony export */   "omit": () => (/* binding */ omit),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "joinObject": () => (/* binding */ joinObject)
/* harmony export */ });
function get(v, ...args) {
  // 没有任何传参 原路返回
  if (!args || args.length === 0) return v;
  var type = typeof v;
  if (v === null || type === "undefined") return v;

  if (args.length === 1 && typeof args[0] === "string") {
    return v[args[0]];
  }

  var temp = v;

  for (var i = 0; i < args.length; i++) {
    var _value = args[i];
    temp = Array.isArray(_value) ? get(temp, ..._value) : get(temp, _value);
    if (temp === null || temp === undefined) return temp;
  }

  return temp;
}
function set(v, key, value) {
  if (typeof v === "object") {
    v[key] = value;
  }

  return false;
}
function equal(v1, v2, level = 0) {
  var samePoint = v1 === v2; // 相同 true

  if (samePoint) return true; // 只比较一层 false 走到这里肯定不等了

  if (level === 0) return false;
  var t1 = typeof v1;
  var t2 = typeof v2;

  if (t1 === t2 && t1 === "object") {
    var keys1 = Object.keys(v1);
    var keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;

    for (var i in keys1) {
      var _key = keys1[i];
      if (!equal(v1[_key], v2[_key], level - 1)) return false;
    }

    return true;
  }

  return false;
}
function omit(v, condition) {
  var result = {};

  var _loop = function (i) {
    // 是否需要过滤出去
    var _canOmit = typeof condition === "string" ? i === condition // 字符串是否相等
    : Array.isArray(condition) ? condition.some(c => c === i) // 是否有这个字符串
    : typeof condition === "function" ? condition(v[i], i) // 是否满足条件
    : false;

    if (!_canOmit) {
      // 不需要推出  那就留存
      result[i] = v[i];
    }
  };

  for (var i in v) {
    _loop(i);
  }

  return result;
}
function pick(v, condition) {
  var result = {};

  var _loop2 = function (i) {
    // 是否需要过滤出去
    var canPick = typeof condition === "string" ? i === condition // 字符串是否相等
    : Array.isArray(condition) ? condition.some(c => c === i) // 是否有这个字符串
    : typeof condition === "function" ? condition(v[i], i) // 是否满足条件
    : false;

    if (canPick) {
      // 不需要推出  那就留存
      result[i] = v[i];
    }
  };

  for (var i in v) {
    _loop2(i);
  }

  return result;
}
function joinObject(object, s, h = (v, k) => "".concat(k, "=").concat(v)) {
  var str = "";
  var isFirst = true;

  for (var i in object) {
    var _v = h(object[i], i);

    str += !isFirst ? s : "" + _v;

    if (isFirst) {
      isFirst = false;
    }
  }

  return str;
}

/***/ }),

/***/ "./src/lazy/utils/Type.ts":
/*!********************************!*\
  !*** ./src/lazy/utils/Type.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isBoolean": () => (/* binding */ isBoolean),
/* harmony export */   "isArray": () => (/* binding */ isArray),
/* harmony export */   "isNull": () => (/* binding */ isNull),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isSymbol": () => (/* binding */ isSymbol),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isEmptyString": () => (/* binding */ isEmptyString),
/* harmony export */   "isSet": () => (/* binding */ isSet),
/* harmony export */   "isMap": () => (/* binding */ isMap),
/* harmony export */   "isUndefined": () => (/* binding */ isUndefined),
/* harmony export */   "isNil": () => (/* binding */ isNil),
/* harmony export */   "isEmpty": () => (/* binding */ isEmpty)
/* harmony export */ });
/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-04-23 10:28:07
 * @modify date 2021-04-23 10:28:07
 * @desc [常用类型]]
 */

/**
 * 是否是数字
 * @param v 任意值
 * @returns
 */
function isNumber(v) {
  return typeof v === "number" && !isNaN(v);
}
/**
 * 是否是布尔值
 * @param v 任意值
 * @returns
 */

function isBoolean(v) {
  return typeof v === "boolean";
}
/**
 * 是否是数组
 * @param v 任意值
 * @returns
 */

function isArray(v) {
  return Array.isArray(v);
}
/**
 * 是否是null值
 * @param v 任意值
 * @returns
 */

function isNull(v) {
  return v === null;
}
function isObject(v, opt = {}) {
  var _isObject = typeof v === "object";

  if (!_isObject) return false;

  if (isBoolean(opt)) {
    return isObject(v, {
      includeArr: opt
    });
  }

  var {
    includeArr = true,
    includeNull = false
  } = opt;
  return (includeArr || !isArray(v)) && (includeNull || !isNull(v));
}
/**
 * 是否是符号
 * @param v 任意值
 * @returns
 */

function isSymbol(v) {
  return typeof v === "symbol";
}
/**
 * 是否是字符串
 * @param v 任意值
 * @returns
 */

function isString(v) {
  return typeof v === "string";
}
/**
 * 是否是空字符串
 * @param v 任意值
 * @returns
 */

function isEmptyString(v) {
  return typeof v === "string" && v === "";
}
/**
 * 是否是集合
 * @param v 任意值
 * @returns
 */

function isSet(v) {
  return v instanceof Set;
}
/**
 * 是否是map
 * @param v 任意值
 * @returns
 */

function isMap(v) {
  return v instanceof Map;
}
/**
 * 是否是undefined
 * @param v 任意值
 * @returns
 */

function isUndefined(v) {
  return typeof v === "undefined";
}
/**
 * 是否是null或者undefined
 * @param v 任意值
 * @returns
 */

function isNil(v) {
  return isNull(v) || isUndefined(v);
}

/**
 *
 * @param v 是否是空数组
 * @param param1
 * @returns
 */
function isEmpty(v, {
  includeArr = true,
  includeObject = true,
  includeNumber = true,
  includeString = true,
  includeNull = true,
  includeUndefined = true
} = {}) {
  return includeNull && isNull(v) || includeUndefined && isUndefined(v) || includeString && isEmptyString(v) || includeNumber && typeof v === "number" && v === 0 || includeArr && Array.isArray(v) && v.length === 0 || includeObject && typeof v === "object" && Object.keys(v).length === 0;
}

/***/ }),

/***/ "./src/lazy/utils/index.ts":
/*!*********************************!*\
  !*** ./src/lazy/utils/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArgsData": () => (/* reexport safe */ _Args__WEBPACK_IMPORTED_MODULE_0__.ArgsData),
/* harmony export */   "chunk": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.chunk),
/* harmony export */   "findArrayDiff": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.findArrayDiff),
/* harmony export */   "flattern": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.flattern),
/* harmony export */   "generateArray": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.generateArray),
/* harmony export */   "generateTreeByArray": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.generateTreeByArray),
/* harmony export */   "mergeArray": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.mergeArray),
/* harmony export */   "toMap": () => (/* reexport safe */ _Array__WEBPACK_IMPORTED_MODULE_1__.toMap),
/* harmony export */   "Debounce": () => (/* reexport safe */ _Async__WEBPACK_IMPORTED_MODULE_2__.Debounce),
/* harmony export */   "Throttle": () => (/* reexport safe */ _Async__WEBPACK_IMPORTED_MODULE_2__.Throttle),
/* harmony export */   "XPromise": () => (/* reexport safe */ _Async__WEBPACK_IMPORTED_MODULE_2__.XPromise),
/* harmony export */   "waitTime": () => (/* reexport safe */ _Async__WEBPACK_IMPORTED_MODULE_2__.waitTime),
/* harmony export */   "autobind": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.autobind),
/* harmony export */   "debounce": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.debounce),
/* harmony export */   "lazy": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.lazy),
/* harmony export */   "loading": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.loading),
/* harmony export */   "pendding": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.pendding),
/* harmony export */   "throttle": () => (/* reexport safe */ _Decorators__WEBPACK_IMPORTED_MODULE_3__.throttle),
/* harmony export */   "equal": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.equal),
/* harmony export */   "get": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.get),
/* harmony export */   "joinObject": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.joinObject),
/* harmony export */   "omit": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.omit),
/* harmony export */   "pick": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.pick),
/* harmony export */   "set": () => (/* reexport safe */ _Object__WEBPACK_IMPORTED_MODULE_4__.set),
/* harmony export */   "isArray": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isArray),
/* harmony export */   "isBoolean": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isBoolean),
/* harmony export */   "isEmpty": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isEmpty),
/* harmony export */   "isEmptyString": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isEmptyString),
/* harmony export */   "isMap": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isMap),
/* harmony export */   "isNil": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isNil),
/* harmony export */   "isNull": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isNull),
/* harmony export */   "isNumber": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isNumber),
/* harmony export */   "isObject": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isObject),
/* harmony export */   "isSet": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isSet),
/* harmony export */   "isString": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isString),
/* harmony export */   "isSymbol": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isSymbol),
/* harmony export */   "isUndefined": () => (/* reexport safe */ _Type__WEBPACK_IMPORTED_MODULE_6__.isUndefined),
/* harmony export */   "EventEmitter": () => (/* reexport safe */ _EventEmitter__WEBPACK_IMPORTED_MODULE_7__.EventEmitter),
/* harmony export */   "IdGenerator": () => (/* reexport safe */ _EventEmitter__WEBPACK_IMPORTED_MODULE_7__.IdGenerator)
/* harmony export */ });
/* harmony import */ var _Args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Args */ "./src/lazy/utils/Args.ts");
/* harmony import */ var _Array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Array */ "./src/lazy/utils/Array.ts");
/* harmony import */ var _Async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Async */ "./src/lazy/utils/Async.ts");
/* harmony import */ var _Decorators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Decorators */ "./src/lazy/utils/Decorators.ts");
/* harmony import */ var _Object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Object */ "./src/lazy/utils/Object.ts");
/* harmony import */ var _interface__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./interface */ "./src/lazy/utils/interface.ts");
/* harmony import */ var _Type__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Type */ "./src/lazy/utils/Type.ts");
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./EventEmitter */ "./src/lazy/utils/EventEmitter.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

















/* harmony default export */ __webpack_exports__["default"] = (_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _Args__WEBPACK_IMPORTED_MODULE_0__), _Array__WEBPACK_IMPORTED_MODULE_1__), _Async__WEBPACK_IMPORTED_MODULE_2__), _Decorators__WEBPACK_IMPORTED_MODULE_3__), _Object__WEBPACK_IMPORTED_MODULE_4__), _interface__WEBPACK_IMPORTED_MODULE_5__), _Type__WEBPACK_IMPORTED_MODULE_6__), _EventEmitter__WEBPACK_IMPORTED_MODULE_7__));

/***/ }),

/***/ "./src/lazy/utils/interface.ts":
/*!*************************************!*\
  !*** ./src/lazy/utils/interface.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./src/lazy/utils/number.ts":
/*!**********************************!*\
  !*** ./src/lazy/utils/number.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "max": () => (/* binding */ max)
/* harmony export */ });
/**
 * 比较一堆数据中最小的
 * @param a
 * @param args
 * @returns
 */
function min(a, ...args) {
  if (!args || args.length <= 0) return a;

  if (args.length === 1) {
    var _b = args[0];
    return a > _b ? _b : a;
  }

  var b = min(args[0], ...args.slice(1));
  return min(a, b);
}
/**
 * 比较一组中最大的
 * @param a
 * @param args
 * @returns
 */

function max(a, ...args) {
  if (!args || args.length <= 0) return a;

  if (args.length === 1) {
    var _b2 = args[0];
    return a < _b2 ? _b2 : a;
  }

  var b = max(args[0], ...args.slice(1));
  return max(a, b);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("bdebec0d9b1864f15dc8")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				registeredStatusHandlers[i].call(null, newStatus);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			setStatus("check");
/******/ 			return __webpack_require__.hmrM().then(function (update) {
/******/ 				if (!update) {
/******/ 					setStatus(applyInvalidatedModules() ? "ready" : "idle");
/******/ 					return null;
/******/ 				}
/******/ 		
/******/ 				setStatus("prepare");
/******/ 		
/******/ 				var updatedModules = [];
/******/ 				blockingPromises = [];
/******/ 				currentUpdateApplyHandlers = [];
/******/ 		
/******/ 				return Promise.all(
/******/ 					Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 						promises,
/******/ 						key
/******/ 					) {
/******/ 						__webpack_require__.hmrC[key](
/******/ 							update.c,
/******/ 							update.r,
/******/ 							update.m,
/******/ 							promises,
/******/ 							currentUpdateApplyHandlers,
/******/ 							updatedModules
/******/ 						);
/******/ 						return promises;
/******/ 					},
/******/ 					[])
/******/ 				).then(function () {
/******/ 					return waitForBlockingPromises(function () {
/******/ 						if (applyOnUpdate) {
/******/ 							return internalApply(applyOnUpdate);
/******/ 						} else {
/******/ 							setStatus("ready");
/******/ 		
/******/ 							return updatedModules;
/******/ 						}
/******/ 					});
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				setStatus("abort");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			// handle errors in accept handlers and self accepted module load
/******/ 			if (error) {
/******/ 				setStatus("fail");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw error;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			if (queuedInvalidatedModules) {
/******/ 				return internalApply(options).then(function (list) {
/******/ 					outdatedModules.forEach(function (moduleId) {
/******/ 						if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 					});
/******/ 					return list;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			setStatus("idle");
/******/ 			return Promise.resolve(outdatedModules);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdate"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.tsx");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map