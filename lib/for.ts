import { Ele } from "./ele";
import { EleOrTag, TreeParams } from "./types";
import { bindSubscrib } from "./update";

export function For<T>(
  tag: EleOrTag<T>,
  params: Omit<TreeParams<T>, "each" | "render"> & {
    each: number | (() => number);
    render: (index: number, getLength: () => number) => Node;
  }
): Node {
  const { each, render, ...rest } = params;
  // eslint-disable-next-line
  const out = Ele(tag, rest as any);

  if (typeof each === "function") {
    bindSubscrib(
      out,
      "__update_for",
      (
        ele: Element & {
          __lastForRender: boolean;
        }
      ) => {
        const rendered = !!ele.__lastForRender;
        ele.__lastForRender = true;
        const nowL = each();

        if (!rendered) {
          const eles = [];
          for (let i = 0; i < nowL; i++) {
            eles.push(render(i, each));
          }
          ele.append(...eles);
          return;
        }
        const l = ele.childNodes.length;
        if (nowL > l) {
          const eles = [];
          for (let i = l; i < nowL; i++) {
            eles.push(render(i, each));
          }
          ele.append(...eles);
        } else {
          for (let i = nowL; i < l; i++) {
            const e = ele.childNodes.item(i);
            if (e) {
              e.remove();
            }
          }
        }
      }
    );
  } else {
    const eles = [];
    for (let i = 0; i < each; i++) {
      eles.push(render(i, () => each));
    }
    out.append(...eles);
  }

  return out;
}
