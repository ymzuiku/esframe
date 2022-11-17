import { Ele } from "./ele";
import { EleOrTag, TreeParams } from "./types";
import { bindSubscrib } from "./update";

export function For<T>(
  tag: EleOrTag<T>,
  params:
    | TreeParams<T>
    | {
        each: number | (() => number);
        render: (index: number, getLength: () => number) => Node;
      }
): Node {
  // eslint-disable-next-line
  const { each, render, ...rest } = params as any;
  const out = Ele(tag, rest);

  if (typeof each === "function") {
    bindSubscrib(
      out,
      "__update_for",
      (
        ele: Element & {
          __lastForRender: number;
        }
      ) => {
        const lastL = ele.__lastForRender;
        const nowL = each();
        ele.__lastForRender = nowL;
        if (!lastL) {
          const eles = [];
          for (let i = 0; i < nowL; i++) {
            eles.push(render(i, each));
          }
          ele.append(...eles);
          return;
        }

        if (nowL > lastL) {
          const eles = [];
          let append = 0;
          for (let i = lastL; i < nowL; i++) {
            append++;
            eles.push(render(i, each));
          }
          ele.append(...eles);
        } else {
          let removed = 0;
          const removes = [];
          for (let i = nowL; i < lastL; i++) {
            const e = ele.childNodes.item(i);
            if (e) {
              removes.push(e);
              removed++;
            }
          }
          removes.forEach((e) => e.remove());
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
