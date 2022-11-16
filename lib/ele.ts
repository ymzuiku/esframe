import { setAttr } from "./update";
import { TreeParams, EleOrTag } from "./types";
import { bindSubscrib } from "./update";

// eslint-disable-next-line
export function tagToElement(tag: any): any {
  // eslint-disable-next-line
  let ele: any;
  if (typeof tag === "string") {
    ele = document.createElement(tag);
  } else {
    ele = tag;
  }
  return ele;
}

export function Ele<T>(tag: EleOrTag<T>, params?: TreeParams<T>) {
  const ele = tagToElement(tag);
  if (params) {
    const keys = Object.keys(params) as (keyof typeof ele)[];
    keys.forEach((k) => {
      // @ts-ignore
      const v = params[k];
      // update props on assignxUpdate
      if (
        typeof v === "function" &&
        // @ts-ignore
        ele.setAttribute &&
        !/^on/.test(k as string)
      ) {
        bindSubscrib(ele, k, v);
        return;
      }

      // @ts-ignore
      setAttr(ele, k, v);
    });
  }
  return ele;
}
