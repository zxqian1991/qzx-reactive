declare namespace JSX {
  interface IntrinsicElements {
    div: { onClick?: any; key?: any; ref?: any };
    span: any;
    [prop: string]: any;
  }
}

declare namespace X {
  import VirtualElement from "./lazy/VirtualElements/index";
  export type FunctionalComponentInited = {
    onCreated?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
    onMounted?: (() => VoidOrVoidFunction) | (() => VoidOrVoidFunction)[];
    onUnMounted?: VoidFunction | VoidFunction[];
  };

  export type FunctionalOperate = {
    nextTick: (h: () => void) => void;
  };

  export interface IFunctionalContext {
    age: number;
  }
  export type FunctionComponentStore<T = any, C = any, S = any, M = any> = {
    inited: boolean; // 是否已经初始化
    unmount: (() => void)[]; // 卸载的时候的回调
    mounted: (() => void)[]; // 组件已装载
    nextticks: (() => void)[];
    context: FunctionContextType<T, C, S, M>;
    virtualElement: VirtualElement;
  };

  export type FunctionalComponent<P extends PropType, S = any> = (
    p?: P | undefined,
    state?: FunctionalComponentInited | undefined,
    q?: FunctionalOperate | undefined
  ) => ElementResultType;

  export type ComputedType<T> = T extends Record<string, any>
    ? {
        [p in keyof T]: ReturnType<T[p]>;
      }
    : T;
  export type ServiceType<T> = T extends Record<
    string,
    new (...args: any[]) => any
  >
    ? {
        [p in keyof T]: InstanceType<T[p]>;
      }
    : T;

  export type ComponentLifeCycle = {
    onCreated?: () => VoidOrVoidFunction;
    onMounted?: () => VoidOrVoidFunction;
    onUnMounted?: VoidFunction;
  };

  export type FunctionContextType<T, C, S, M> = M & {
    state: T;
    computed: ComputedType<C>;
    services: ServiceType<S>;
    setStore: <K extends keyof IFunctionalContext>(
      key: K,
      v: IFunctionalContext[K]
    ) => void;
    store: Partial<IFunctionalContext>;
  };

  export type FunctionalComponentConfig<T, C, S, M> = {
    state?: T;
    computed?: C & ThisType<FunctionContextType<T, C, S, M>>;
    services?: S & ThisType<FunctionContextType<T, C, S, M>>;
    lifeCycle?: ComponentLifeCycle & ThisType<FunctionContextType<T, C, S, M>>;
    methods?: M & ThisType<FunctionContextType<T, C, S, M>>;
  };

  export type FunctionalValue = () => any;

  export interface ChildrenType {
    children?: (VirtualElement | FunctionalValue)[];
  }

  export interface KeyType {
    key?: any;
  }

  export type PropType<T extends Record<string, any> = any> = T &
    ChildrenType &
    KeyType;

  // export interface PropType extends Record<string, any>, ChildrenType {}

  export type FunctionalPropType = "rest" | "normal";
  export type FunctionalProp = {
    type: FunctionalPropType;
    value: FunctionalValue;
    property?: string;
  };
  export interface IDomPosition {
    parent: IDomElement | null;
    nextSibling: IDomElement | null | undefined;
    preSibling: IDomElement | null | undefined;
  }
  export interface IDocument {
    isTextElement: (result: any) => boolean;
    createTextElement: (text: string) => ITextElement;
    createElement: (tag: string) => IDomElement;
    querySelector: (ele: string) => IDomElement | null;
    querySelectorAll: (ele: string) => IDomElement[] | null;
    canRunning(): Promise<boolean>;
  }

  export interface IDomElement {
    append: (eles: IDomElement[] | IDomElement) => void;
    nextSibling: IDomElement | null;
    preSibling: IDomElement | null;
    parent: IDomElement | null;
    getText: () => string;
    setText: (str: string) => void;
    insertBefore: (doms: IDomElement[], target: IDomElement | null) => void; // 在子元素dom前插入新的元素
    setAttribute: (attr: string, value: any) => void;
    removeAttribute: (attr: string, value?: any) => void;
    remove: () => void;
    clear: () => void;
  }

  export interface ITextElement extends IDomElement {}

  export interface IDirectiveOption<T> {
    param?: T; // 指令被传递的参数
    onCreated?: () => void | (() => void);
    onMounted?: () => void | (() => void);
  }

  export interface IDirectives {}

  export type VoidOrVoidFunction = void | VoidFunction;

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
    autoAppendAsSubTask?: boolean;
    notRecord?: (t: any, k: string | number, v: any) => boolean; // 有可能有的值不需要被记录 这里需要记录
  }
}
