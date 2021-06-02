export * from "./Args";
export * from "./Array";
export * from "./Async";
export * from "./Decorators";
export * from "./Object";
export * from "./interface";
export * from "./Type";
export * from "./EventEmitter";

import * as Args from "./Args";
import * as Arr from "./Array";
import * as Async from "./Async";
import * as Decorators from "./Decorators";
import * as Obj from "./Object";
import * as Inter from "./interface";
import * as Type from "./Type";
import * as event from "./EventEmitter";

export default {
  ...Args,
  ...Arr,
  ...Async,
  ...Decorators,
  ...Obj,
  ...Inter,
  ...Type,
  ...event,
};
