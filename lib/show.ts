import { bindSubscrib } from "./update";

export function createEmpty() {
  const span = document.createElement("span");
  span.style.all = "none";
  return span;
}

export function Show({
  when,
  render,
}: {
  when: boolean | (() => boolean | Promise<boolean>);
  render: () => Node;
}): Node {
  if (!when) {
    return createEmpty();
  }
  const base = createEmpty();
  if (typeof when === "function") {
    const createShowBind = (bindEle: Node) => {
      bindSubscrib(
        bindEle,
        "__update_show",
        (ele: Element & { __lastShow?: boolean }) => {
          Promise.resolve(when()).then((v) => {
            if (v === ele.__lastShow) {
              return;
            }
            const nextEle = v ? render() : createEmpty();
            createShowBind(nextEle);
            ele.replaceWith(nextEle);
            ele.__lastShow = v;
          });
        },
        true
      );
    };
    createShowBind(base);
  }
  return base;
}
