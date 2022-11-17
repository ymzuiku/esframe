// GlobalEventHandlers
type OptionFn<T> = {
  [P in keyof T]?: P extends keyof GlobalEventHandlers
    ? T[P]
    : T[P] extends Function
    ? // @ts-ignore
      Parameters<T[P]>
    : T[P] extends string
    ? string | number
    : Partial<T[P]>;
};
type ValueToFn<T> = {
  [P in keyof T]?: T[P] | (() => T[P]);
};
type TagKey<K> = K extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[K]
  : K;

interface LifeEvents<T> {
  // eslint-disable-next-line
  ref?: (ele: TagKey<T>) => any;
  onMount?: (ele: TagKey<T>) => any;
  onCleanup?: (ele: TagKey<T>) => any;
  onEntry?: (ele: TagKey<T>) => any;
}

export type TreeParams<T> =
  | ValueToFn<OptionFn<TagKey<T>>>
  | LifeEvents<T>
  | Omit<{ [key in string]: unknown }, keyof T>;
export type EleOrTag<T> = T | keyof HTMLElementTagNameMap;

export type Child =
  | Element
  | Node
  | string
  | number
  | ((ele: Element | Node) => void);
export type Children = Child[];
