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
export function isNumber<T>(v: T) {
  return typeof v === "number" && !isNaN(v);
}

/**
 * 是否是布尔值
 * @param v 任意值
 * @returns
 */
export function isBoolean<T>(v: T) {
  return typeof v === "boolean";
}

/**
 * 是否是数组
 * @param v 任意值
 * @returns
 */
export function isArray<T>(v: T) {
  return Array.isArray(v);
}

/**
 * 是否是null值
 * @param v 任意值
 * @returns
 */
export function isNull<T>(v: T) {
  return v === null;
}
export interface IsObjectOpt {
  includeArr?: boolean; // 是否包含数组  默认包含
  includeNull?: boolean; // 是否包含null 默认不包含
}

/**
 * 是否是对象
 * @param v 任意值
 * @param includeArr  是否包含数组
 * @param includeNull 是否包含控制
 */
export function isObject<T>(v: T, includeArr: boolean): boolean;
export function isObject<T>(v: T, includeArr: IsObjectOpt): boolean;
export function isObject<T>(v: T, opt: IsObjectOpt | boolean = {}) {
  const _isObject = typeof v === "object";
  if (!_isObject) return false;
  if (isBoolean(opt)) {
    return isObject(v, { includeArr: opt as boolean });
  }
  const { includeArr = true, includeNull = false } = opt as IsObjectOpt;
  return (includeArr || !isArray(v)) && (includeNull || !isNull(v));
}

/**
 * 是否是符号
 * @param v 任意值
 * @returns
 */
export function isSymbol<T>(v: T) {
  return typeof v === "symbol";
}

/**
 * 是否是字符串
 * @param v 任意值
 * @returns
 */
export function isString<T>(v: T) {
  return typeof v === "string";
}
/**
 * 是否是空字符串
 * @param v 任意值
 * @returns
 */
export function isEmptyString<T>(v: T) {
  return typeof v === "string" && v === "";
}

/**
 * 是否是集合
 * @param v 任意值
 * @returns
 */
export function isSet<T>(v: T) {
  return v instanceof Set;
}

/**
 * 是否是map
 * @param v 任意值
 * @returns
 */
export function isMap<T>(v: T) {
  return v instanceof Map;
}

/**
 * 是否是undefined
 * @param v 任意值
 * @returns
 */
export function isUndefined<T>(v: T) {
  return typeof v === "undefined";
}

/**
 * 是否是null或者undefined
 * @param v 任意值
 * @returns
 */
export function isNil<T>(v: T) {
  return isNull(v) || isUndefined(v);
}

export interface IsEmptyOpt {
  // 包含数组的空值
  includeArr?: boolean;
  // 包含普通对象
  includeObject?: boolean;
  //  包含数字
  includeNumber?: boolean;
  // 包含字符串
  includeString?: boolean;
  // 包含null
  includeNull?: boolean;
  // 包含undefined
  includeUndefined?: boolean;
}
/**
 *
 * @param v 是否是空数组
 * @param param1
 * @returns
 */
export function isEmpty<T>(
  v: T,
  {
    includeArr = true,
    includeObject = true,
    includeNumber = true,
    includeString = true,
    includeNull = true,
    includeUndefined = true,
  }: IsEmptyOpt = {}
) {
  return (
    (includeNull && isNull(v)) ||
    (includeUndefined && isUndefined(v)) ||
    (includeString && isEmptyString(v)) ||
    (includeNumber && typeof v === "number" && v === 0) ||
    (includeArr && Array.isArray(v) && v.length === 0) ||
    (includeObject && typeof v === "object" && Object.keys(v).length === 0)
  );
}
