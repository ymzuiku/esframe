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

export type TreeParams<T> =
  | ValueToFn<OptionFn<TagKey<T>>>
  | Omit<{ [key in string]: unknown }, keyof T>;
export type EleOrTag<T> = T | keyof HTMLElementTagNameMap;

// const dog = <T>(ele: T, params: TreeParams<T>) => {};

// dog(document.createElement("div"), {
//   dog: "aaaaa",
//   oninput: (e) => {
// 		const value = (e.currentTarget as HTMLInputElement).value;
//     return value;
//   },
// });
