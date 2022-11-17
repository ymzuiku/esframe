import { setAttr } from "./update";
import { TreeParams, EleOrTag } from "./types";
import { bindSubscrib } from "./update";
import { onCleanup, onEntry, onMount } from "./onMount";

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

      if (ele.setAttribute) {
        if (typeof v === "function" && !/^on/.test(k as string)) {
          if (k === "ref") {
            v(ele);
            return;
          }
          bindSubscrib(ele, k, v);
          return;
        }
        if (k === "onMount") {
          onMount(ele as Element, v);
          return;
        }
        if (k === "onCleanup") {
          onCleanup(ele as Element, v);
          return;
        }
        if (k === "onEntry") {
          onEntry(ele as Element, v);
          return;
        }
      }

      // @ts-ignore
      setAttr(ele, k, v);
    });
  }
  return ele;
}

(window as any).JSX_ELE = Ele;
