import { lazyDocument } from "./Document";
import { onLazyable, LazyableOptType } from "./Lazyable";
import { autobind } from "./utils";
/**
 * @author [qianzhixiang]
 * @email [zxqian199@163.com]
 * @create date 2021-05-28 15:43:24
 * @modify date 2021-05-28 15:43:24
 * @desc [description] 执行任务并记录依赖
 */

let TMEP_RUNNING_TASK: LazyTask | undefined;
export function getRunningTask() {
  return TMEP_RUNNING_TASK;
}
function setRunnintTask(task?: LazyTask) {
  TMEP_RUNNING_TASK = task;
}

export function runExcludeTask<T = any>(h: () => T) {
  if (TMEP_RUNNING_TASK) {
    return TMEP_RUNNING_TASK.except(() => h());
  }
  return h();
}

export interface ILazyTaskHandlerOption<T = any> {
  runTime: number;
  getTask: () => LazyTask;
  except: <K>(h: () => K) => K;
  setData: (v: T) => void;
  getData: () => T | undefined;
  lastUnsub: (isStop?: boolean) => void;
  reasons?: TaskChangeReason[];
  addSubTask: (subTask: LazyTask) => void;
  removeSubTask: (subTask: LazyTask, stop?: boolean) => void;
  stop: () => void;
  id: number;
}

export interface ILazyTaskOption {
  autoRun?: boolean; // 是否自动的执行
  maxRunTime?: number; // 最多执行的次数
  autoUnsub?: boolean;
  notRecord?: (t: any, k: string | number, v: any) => boolean; // 有可能有的值不需要被记录 这里需要记录
}
let id = 0;
export class LazyTask<T = any> {
  private stopped = false;

  private unsub?: (isStop: boolean) => void;

  private data?: T;

  private time = 0;

  public id = id++;

  parent?: LazyTask;

  path!: string;

  private level?: number;

  root!: LazyTask;
  private changeReasons: TaskChangeReason[] = [];

  canRecordRely = true;
  // 停止记录依赖
  private stopRecordRely() {
    this.canRecordRely = false;
  }
  // 可以记录以来
  private startRecordRely() {
    this.canRecordRely = true;
  }
  private subTasks = new Set<LazyTask>();
  constructor(
    private handler: (
      option: ILazyTaskHandlerOption<T>
    ) => void | undefined | ((isStop: boolean) => void),
    private option: ILazyTaskOption = {}
  ) {
    const parent = getRunningTask();
    this.parent = parent!;
    this.root = parent ? parent.root! : this;
    this.level = parent ? parent.level! + 1 : 1;
    this.path = parent ? `${parent.path}-${this.id}` : `${this.id}`;
    if (this.option.autoRun || this.option.autoRun === undefined) {
      this.run();
    }
  }
  canRecord(t: any, k: string | number, v: any) {
    if (!this.canRecordRely) return false;
    if (!this.option.notRecord || typeof this.option.notRecord !== "function")
      return true;
    return !this.option.notRecord(t, k, v);
  }
  run(reasons: TaskChangeReason[] = []) {
    if (this.stopped) {
      throw new Error("任务已终止！");
    }
    const lastTask = getRunningTask();
    setRunnintTask(this);
    const shouldAutoUnsub =
      this.option.autoUnsub || this.option.autoUnsub === undefined;
    shouldAutoUnsub && this.unsub?.(false);
    const lastUnsub = shouldAutoUnsub ? () => {} : () => this.unsub?.(false);
    removeRely(this);
    this.unsub =
      this.handler({
        id: this.id,
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
        stop: this.stop,
      }) || undefined!;
    setRunnintTask(lastTask);
  }

  @autobind
  except<T = any>(h: () => T) {
    this.stopRecordRely();
    const res = h();
    this.startRecordRely();
    return res;
  }

  @autobind
  setData(data: T) {
    this.data = data;
  }

  @autobind
  getData() {
    return this.data;
  }

  /**
   * 停止执行任务
   */
  @autobind
  stop() {
    // 清理子任务
    // 清理子任务
    if (this.stopped) return;
    removeRely(this);
    this.subTasks.forEach((t) => t.stop());
    this.stopped = true;
    this.unsub?.(true);
    this.unsub = undefined!;
    this.subTasks.clear();
    this.data = undefined!;
    this.changeReasons = [];
  }

  hasStopped() {
    return this.stopped;
  }

  addReason(reasons?: TaskChangeReason[]) {
    reasons?.forEach((r) => this.changeReasons.push(r));
  }

  restart(force = false) {
    if (!force && this.stopped) return;
    if (this.stopped) return;
    this.run(this.changeReasons);
    this.changeReasons = [];
  }

  @autobind
  addSubTask(task: LazyTask) {
    this.subTasks.add(task);
    if (task.parent !== this) {
      task.parent = this;
      task.path = `${this.path}-${task.id}`;
    }
  }
  @autobind
  removeSubTask(task: LazyTask, stop = true) {
    if (stop) task.stop();
    this.subTasks.delete(task);
  }
}

export type TaskChangeReason = {
  target: any; // 导致变化的对象
  key: any; // 导致变化的key
  type: LazyableOptType;
  value: any;
  oldValue?: any;
};

// 任务依赖了哪些对象的哪些属性
const TASK_TARGET_RELY = new Map<LazyTask, Map<any, Set<string>>>();
// 对象的哪些属性被哪些对象依赖了
const TARGET_TASK_RELY = new Map<any, Map<string, Set<LazyTask>>>();
function addRely(task: LazyTask, t: any, k: string) {
  if (!TASK_TARGET_RELY.has(task)) {
    TASK_TARGET_RELY.set(task, new Map());
  }
  if (!TASK_TARGET_RELY.get(task)?.has(t)) {
    TASK_TARGET_RELY.get(task)?.set(t, new Set());
  }
  TASK_TARGET_RELY.get(task)?.get(t)?.add(k);
  if (!TARGET_TASK_RELY.has(t)) {
    TARGET_TASK_RELY.set(t, new Map());
  }
  if (!TARGET_TASK_RELY.get(t)?.has(k)) {
    TARGET_TASK_RELY.get(t)?.set(k, new Set());
  }
  TARGET_TASK_RELY.get(t)?.get(k)?.add(task);
}
function removeRely(task: LazyTask) {
  const t = TASK_TARGET_RELY.get(task);
  TASK_TARGET_RELY.delete(task);
  t?.forEach((keys, target) => {
    keys.forEach((key) => {
      TARGET_TASK_RELY.get(target)?.get(key)?.delete(task);
      if (TARGET_TASK_RELY.get(target)?.get(key)?.size === 0) {
        TARGET_TASK_RELY.get(target)?.delete(key);
      }
      if (TARGET_TASK_RELY.get(target)?.size === 0) {
        TARGET_TASK_RELY.delete(target);
      }
    });
  });
}

onLazyable("get", (t, k, v) => {
  // 任务得允许被记录
  if (
    TMEP_RUNNING_TASK &&
    TMEP_RUNNING_TASK.canRecord(t, k as string | number, v)
  ) {
    addRely(TMEP_RUNNING_TASK, t, k as string);
  }
});

/**
 * 判断target是不是node的父亲节点
 * @param node 判断的节点
 * @param target 被比较的节点
 * @returns
 */
function isParentNode(node: string, target: string, sep = "-") {
  return (
    node.length > target.length &&
    node.indexOf(target) === 0 &&
    node[target.length] === sep
  );
}
function filterTreeTask(tasks: LazyTask[]) {
  if (tasks.length <= 0) return [];
  let results = new Set([tasks[0]]);
  for (let i = 1; i < tasks.length; i++) {
    let tempResults = Array.from(results);
    for (let j = 0; j < tempResults.length; j++) {
      const task = tasks[i];
      const result = tempResults[j];
      // 是父节点 替换
      if (isParentNode(result.path, task.path)) {
        // 加入
        results.add(task);
        // 删除子节点
        results.delete(result);
      } else if (isParentNode(task.path, result.path)) {
        // 已经有了父节点
        continue;
      } else {
        results.add(task);
      }
    }
  }
  return Array.from(results);
}

let tasksToRun = new Set<LazyTask>();
let isInLifeCycle = false;
const lifeCycleGap = 10;
function addLifeTask(task: LazyTask, reasons: TaskChangeReason[]) {
  task.addReason(reasons);
  tasksToRun.add(task);
  // 已经在运行中 可以开启新的setTimeout计时了
  if (!isInLifeCycle) {
    isInLifeCycle = true;
    setTimeout(async () => {
      isInLifeCycle = false;
      const rawTasks = Array.from(tasksToRun);
      const tasks = filterTreeTask(rawTasks);
      tasksToRun.clear();
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].restart();
        await lazyDocument.canRunning();
      }
    }, lifeCycleGap);
  }
}

onLazyable("set", (t, k, v, ov, isAdd) => {
  TARGET_TASK_RELY.get(t)
    ?.get(k as string)
    ?.forEach((task) =>
      addLifeTask(task, [
        {
          target: t,
          key: k,
          type: isAdd ? "add" : "set",
          value: v,
          oldValue: ov,
        },
      ])
    );
});
onLazyable("delete", (t, k, ov) => {
  TARGET_TASK_RELY.get(t)
    ?.get(k as string)
    ?.forEach((task) =>
      addLifeTask(task, [
        {
          target: t,
          key: k,
          type: "delete",
          value: undefined,
          oldValue: ov,
        },
      ])
    );
});

export function Computed<T>(h: () => T) {
  const value: { value: undefined | T; stop: () => void } = {
    value: undefined,
    stop() {
      return task.stop();
    },
  };
  const task = new LazyTask((o) => {
    value.value = h();
  });
  return value;
}
