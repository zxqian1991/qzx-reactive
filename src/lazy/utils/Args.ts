import { equal } from "./Object";
/**
 * 用来判断参数是否一致的类
 * timeout 超时时间
 */
export default class CacheArgs {
  argsDataList: ArgsData[] = [];
  constructor(private timeout = 1000, private level = 1) {}

  /**
   * 添加新的参数
   * 若返回true 表示这个参数已存在
   * 若返回false 表示这个参数已经不存在
   * @param args 传入的args
   * @returns ArgsData
   */
  getArgs(args: any[] = []): ArgsData | undefined {
    return this.argsDataList.find((data) => data.isSame(args, this.level));
  }

  /**
   * 添加新的args
   * @param args
   * @returns
   */
  addArgs(args: any[] = [], onTimeout?: (v: any) => void) {
    const old = this.getArgs(args);
    if (old) {
      return old;
    }
    const newData = new ArgsData(args, this);
    this.argsDataList.push(newData);
    if (this.timeout >= 0) {
      setTimeout(() => {
        const value = newData.getValue();
        this.remove(newData);
        newData.clear();
        onTimeout?.(value);
      }, this.timeout);
    }
    return newData;
  }
  remove(argsData: ArgsData) {
    this.argsDataList = this.argsDataList.filter((i) => i !== argsData);
  }
}

export class ArgsData {
  valueMap = new Map<string, any>();
  constructor(private args: any[] = [], private cache: CacheArgs) {}
  /**
   * 判断是否是相同的参数
   * @param args 传入的参数
   * @returns boolean
   */
  clear() {
    this.valueMap.clear();
  }
  isSame(args: any[] = [], level = 1) {
    return equal(args, this.args, level);
  }

  setValue<T>(value: T, key = "default") {
    this.valueMap.set(key, value);
    return value;
  }
  getValue<T>(key = "default"): T {
    return this.valueMap.get(key);
  }
}
