import { BootMap } from "./BootMap";

function isSvg(ele: any) {
  if (ele.tagName === "svg" || ele.ownerSVGElement) {
    return true;
  }
  return false;
}

export const attributeKeys: { [key: string]: boolean } = {
  autofocus: true,
  role: true,
  viewBox: true,
  disabled: true,
  class: true,
};

const setAttributeKeys: Record<string, boolean> = {};

export function setAttr(ele: any, key: string | number | symbol, value: any) {
  if (Array.isArray(value)) {
    ele[key](...value);
    return;
  }
  if (typeof value === "object") {
    Object.assign(ele[key], value);
    return;
  }
  // 减少不必要的 dom 操作
  if (!ele.__lastAttr) {
    ele.__lastAttr = {};
  }
  if (ele.__lastAttr[key] === value) {
    return;
  }
  ele.__lastAttr[key] = value;
  if (
    ele.setAttribute &&
    (setAttributeKeys[key as string] ||
      attributeKeys[key as string] ||
      /-/.test(key as string) ||
      isSvg(ele))
  ) {
    setAttributeKeys[key as string] = true;
    if (value === undefined || value === null) {
      ele.removeAttribute(key);
    } else {
      ele.setAttribute(key as string, value);
    }
    return;
  }

  ele[key] = value;
}

// eslint-disable-next-line
export function bindSubscrib(
  ele: Node,
  key: any,
  fn: any,
  ignoreAutoRun?: boolean
) {
  // @ts-ignore
  ele.setAttribute!("data-x-subscrib", "");
  // @ts-ignore
  if (!ele.__x_subscrib) {
    // @ts-ignore
    ele.__x_subscrib = {};
  }
  // @ts-ignore
  ele.__x_subscrib[key] = fn;

  if (!ignoreAutoRun) {
    if (/^(__update)/.test(key as string)) {
      fn(ele, key);
      return;
    }
    // @ts-ignore
    Promise.resolve(fn(ele, key)).then((value) => {
      setAttr(ele, key, value);
    });
  }
}

// eslint-disable-next-line
const nextElements = new Set<Element & { __x_subscrib: Record<string, any> }>();

const updateNextElements = () => {
  nextElements.forEach((e) => {
    if (e.__x_subscrib) {
      const keys = Object.keys(e.__x_subscrib);
      keys.forEach((k) => {
        const fn = e.__x_subscrib[k];
        if (/^(__update)/.test(k as string)) {
          fn(e, k);
          return;
        }
        Promise.resolve(fn(e, k)).then((value) => {
          setAttr(e, k, value);
        });
      });
    }
  });
  nextElements.clear();
};

// eslint-disable-next-line
function updateOne(ele: any) {
  if ((ele as Element).hasAttribute("data-x-subscrib")) {
    nextElements.add(ele);
  }
  const eles = (ele as Element).querySelectorAll("[data-x-subscrib]");
  // @ts-ignore
  eles.forEach((e: any) => {
    nextElements.add(e);
  });
}

const filterEvents = new BootMap<any, number>();
// eslint-disable-next-line
let fullUpdateEvents: any;
let lastElementSize = 0;

function fixFullTimeout() {
  if (lastElementSize < 3000) {
    return 17;
  }
  return (lastElementSize / 3000) * 17;
}

// 全量更新, 所有订阅的属性, 可以选择优先更新的元素, 其他全量元素会延迟更新
export function toUpdate(
  // 优先更新的元素
  priority:
    | (Element | Node | string | null)
    | (Node | Element)[] = document.body,
  options: {
    ignoreSupplement?: boolean;
  } = {}
) {
  if (priority !== null) {
    const lastRaf = filterEvents.get(priority) || 0;
    if (lastRaf) {
      cancelAnimationFrame(lastRaf);
    }
    const nextRef = requestAnimationFrame(() => {
      filterEvents.delete(priority);
      if (typeof priority === "string") {
        document.body.querySelectorAll(priority).forEach(updateOne);
      } else if (Array.isArray(priority)) {
        priority.forEach(updateOne);
      } else {
        updateOne(priority);
      }
      updateNextElements();
    });
    filterEvents.set(priority, nextRef);
  }
  if (!options.ignoreSupplement && priority !== document.body) {
    if (fullUpdateEvents) {
      return;
    }
    fullUpdateEvents = setTimeout(() => {
      fullUpdateEvents = null;
      updateOne(document.body);
      lastElementSize = nextElements.size;
      updateNextElements();
    }, fixFullTimeout());
  }
}
