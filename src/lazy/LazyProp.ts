import { PropType, FunctionalValue, FunctionalProp } from "./common";
import { Lazyable, Raw, onLazyable } from "./Lazyable";
import { LazyTask } from "./LazyTask";
import VirtualElement from "./VirtualElement";

/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-05-08 13:39:28
 * @modify date 2021-05-08 13:39:28
 * @desc [自动响应的对象]
 */

export class LazyProp {
  // 对外暴露的prop，是一个lazyable的对象
  private prop: PropType = Lazyable({});

  private preserveProp: PropType = Lazyable({});
  // prop的主任务 用来控制任务的运行
  private mainTask?: LazyTask;
  // 对外暴露的方法，用以获取prop
  getProp() {
    return this.prop;
  }
  // 存储所有属性的地方(一个属性可能对象都拥有，某一个对象的属性被删除了 下一个要接替。)
  private store = new Map<
    string | number,
    {
      index: number; // 所在位置
      task: LazyTask;
    }[]
  >();

  private preserveStore = new Map<
    string | number,
    {
      index: number; // 所在位置
      task: LazyTask;
    }[]
  >();
  private id!: number | string;
  private key?: FunctionalValue;
  private props: FunctionalProp[] = [];
  private children: FunctionalValue[] = [];
  constructor(
    // private id: number | string,
    // private key: FunctionalValue | undefined,
    private virualElemet: VirtualElement // private props: FunctionalProp[] = [], // private children: FunctionalValue[] = []
  ) {
    this.id = this.virualElemet.id;
    this.key = this.virualElemet.key;
    this.props = this.virualElemet.props;
    this.children = this.virualElemet.children;
    this.init();
  }

  // props里面可能是存在children属性的 但是 只要this.children存在就表示props里面的children都是无效的
  private canHandleChildren(property: string) {
    return (
      property &&
      this.children &&
      property === "children" &&
      this.children.length > 0
    );
  }
  // 给prop赋值children 同时标记这个children是一个属于组件子节点的children 便于控制
  private handleChildren() {
    if (typeof this.id === "string") {
      this.prop.children = this.children;
      return;
    }
    // fragment类型的数据不用处理
    const result = this.children.map(
      (i, index) =>
        new VirtualElement(
          `${this.id}`,
          () => `${this.id}-${index}`,
          "fragment",
          [],
          [i as FunctionalValue]
        )
    );

    // 给children重新赋值 这回触发更新 更新时根据key + fragment进行对比
    this.prop.children = result;
  }

  /**
   * 处理普通的属性
   * @param p
   * @param i
   * @returns
   */
  private handleNormal(p: FunctionalProp, i: number) {
    const property = p.property;
    if (property) {
      // 是children的话 什么都不用做
      if (this.canHandleChildren(property)) {
        return;
      }

      if (property === "ref") {
        return this.handleRef(p.value);
      }
      const rawProp = Raw(this.prop);
      // 不是children的话 就要创建这个任务 任务默认不启动 在addProperty中进行控制
      const task = new LazyTask(
        (o) => {
          // 重新赋值属性 并重新记录依赖
          const value = p.value();
          const originValue = rawProp[property];
          if (value !== originValue) {
            this.prop[property] = value;
          }
        },
        {
          autoRun: false,
        }
      );
      // 将属性添加到store中
      this.addProperty(property, i, task);
    }
  }

  private handleRef(value: FunctionalValue) {
    // 处理REF 主要是返回
    let target: any;
    let key: string | number | symbol | undefined;
    const unsub = onLazyable("get", (t, k, v) => {
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
  private removeProperty(
    property: string,
    index: number,
    onMatch?: (item: { index: number; task: LazyTask<any> }) => void
  ) {
    if (this.store.has(property)) {
      const arr = this.store.get(property)!;
      // 过滤符合条件的
      const filtResult = arr?.filter((v) => {
        const match = v.index === index;
        if (match) {
          // 符合条件 移除这个任务
          // restTask.stopExceptSubTask(v.task);
          v.task.stop();
          onMatch?.(v);
        }
        return !match; // 留下的肯定是没匹配的 别弄错了
      });
      // 最后一个任务自动重启
      if (
        filtResult &&
        filtResult.length > 0 &&
        filtResult[filtResult.length - 1].task.hasStopped()
      ) {
        filtResult[filtResult.length - 1].task.restart([], true);
      }
      this.store.set(property, filtResult);
    }
  }
  private handleRest(p: FunctionalProp, i: number) {
    // 有一个任务单独的去监听对象的变化
    const restProperties = new Set<string>();
    // 储存的上一次的值 来判断是否需要重新计算
    let value: any;
    return new LazyTask(
      (o) => {
        // 重新计算  会产生新的依赖
        const restValue = p.value();
        // 两个值不一样 那得清空上一个值得信息
        if (value !== restValue) {
          // 之前记录了这个rest的值有哪些属性 在这里我们要将这些相关的信息都清空 以便重新计算
          restProperties.forEach((property) =>
            // 移除属性的同时会自动的启停任务
            this.removeProperty(property, i)
          );
          // 清空旧值的基本信息
          restProperties.clear();
          // 移除旧值的监听
          o.lastUnsub();
          // 监听新增属性的逻辑
          const unsub = onLazyable("add", restValue, (t, property, v) => {
            // 判断是否呀哦处理children
            if (this.canHandleChildren(property as string)) {
              return;
            }
            if (property === "ref") {
              return this.handleRef(() => restValue["ref"]);
            }
            // 添加到属性存储中
            restProperties.add(property as string);
            const rawProp = Raw(this.prop);
            // 新建属性的监听任务
            const pTask = new LazyTask(
              () => {
                // 直接赋值
                if (restValue.hasOwnProperty(property)) {
                  const originValue = rawProp[property as string];
                  const value = restValue[property];
                  if (originValue !== value) {
                    this.prop[property as string] = value;
                  }
                } else {
                  // 不存在这个属性了  表示这个属性被删了
                  restProperties.delete(property as string);
                  // 移除store中的存储
                  this.removeProperty(property as string, i);
                }
              },
              {
                autoRun: false,
              }
            );
            // 把这个加入到监听属性中去
            this.addProperty(property as string, i, pTask);
          });
          // 监听函数没有在任务最后自动销毁  因为可能是同一个值，新建销毁的是没必要的浪费

          // 遍历它所有的属性
          for (let property in restValue) {
            // 保存当前所有的属性
            if (this.canHandleChildren(property as string)) {
              continue;
            }
            if (property === "ref") {
              return this.handleRef(() => restValue["ref"]);
            }
            restProperties.add(property);
            // 新建属性的监听任务
            const pTask = new LazyTask(
              () => {
                if (restValue.hasOwnProperty(property)) {
                  this.prop[property] = restValue[property];
                } else {
                  // 不存在这个属性了  表示这个属性被删了
                  restProperties.delete(property);
                  this.removeProperty(property, i, (v) => v.task.stop());
                }
              },
              {
                autoRun: false,
              }
            );
            this.addProperty(property, i, pTask);
          }
          // 要移除对新增属性的事件的监听
          return () => unsub();
        } else {
          // 值一样 咱就不管 返回上个任务的回调 便于最后销毁的时候调用
          return o.lastUnsub;
        }
        // 两个值相等 啥都不用做
      },
      {
        autoUnsub: false,
      }
    );
  }

  /**
   * 添加一个新的属性到store中去
   * 如果是最后一个 要停止上一个任务 开始新的任务
   * @param property
   * @param index
   * @param task
   */
  private addProperty(property: string, index: number, task: LazyTask) {
    if (!this.store.has(property)) {
      this.store.set(property, []);
    }
    // 先获取这个属性存储的结果
    const storeArr = this.store.get(property)!;
    // 进件存储的内容
    const data = {
      index,
      task,
    };
    // 结果是空的 说明没别的属性位置 直接运行
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
      for (let i = storeArr.length - 1; i >= 0; i--) {
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
  private init() {
    // children可以处理 先处理下children
    if (this.canHandleChildren("children")) {
      this.handleChildren();
    }
    // 开启主任务
    this.mainTask = new LazyTask(
      (o) => {
        // key传递给后代 防止要用
        if (this.key) {
          this.handleNormal(
            { type: "normal", property: "key", value: this.key },
            -1
          );
        }
        for (let i = 0; i < this.props.length; i++) {
          const p = this.props[i];
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
          this.store.forEach((v) => v.forEach((i) => i.task.stop()));
          this.store.clear();
        };
      },
      {
        maxRunTime: 1, // 主任务最多运行一次
      }
    );
  }
  stop() {
    this.mainTask?.stop();
    this.mainTask = undefined;
  }

  update(
    id: number | string,
    props: FunctionalProp[] = [],
    children: FunctionalValue[] = []
  ) {
    // 先获取到旧的属性列表
    const oldSet = new Set(this.store.keys());
    // 停止一切的任务 + 清空store
    this.stop();
    this.id = id;
    this.props = props;
    this.children = children;
    // 重新计算
    this.init();
    // 获取新计算得到的属性列表
    const newSet = new Set(this.store.keys());
    // 过滤相同的属性 留下不同的
    newSet.forEach((property) => oldSet.delete(property));
    // 移除不需要的属性
    oldSet.forEach((property) => delete this.prop[property]);
  }
}
