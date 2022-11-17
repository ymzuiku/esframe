import { For, Show, Ele, toUpdate } from "../lib";

const css = Ele("style", {
  textContent: `
.contains {
	background: #f3f3f3;
	font-size:40px;
}
`,
});
document.head.append(css);

const state: Record<string, string> = {
  value0: "2000",
};

const app = Ele("div", {
  className: "contains",
  style: {
    cssText: "width:100%; height:100%;",
  },
  append: [
    "Hello",
    Ele("span", {
      innerText: "world",
      style: {
        cssText: "color:red;",
      },
      onclick: () => {
        alert("hello");
      },
    }),
    Show(
      () => Date.now() % 3 !== 0,
      () => {
        return Ele("span", { textContent: "show temp" });
      }
    ),
    For("div", {
      each: () => {
        const v = Number(state["value0"]) / 200;
        return v > 15000 ? 15000 : v;
      },
      dog: "aaaaa",
      ["data-length"]: async (ele: Element) => {
        await new Promise((res) => setTimeout(res, 1000));
        return ele.children.length;
      },
      render: (i, len) => {
        const area = () => i % (len() / 5);
        return Ele("input", {
          // bind subscribe value
          value: () => state["value" + area()],
          ["data-i"]: i,
          // ref: (ele) => {
          //   console.log("ref", ele);
          // },
          // onMount: (ele) => {
          //   console.log("mount", ele);
          // },
          // onCleanup: (ele) => {
          //   console.log("cleanup", ele);
          // },
          // onEntry: (ele) => {
          //   console.log("entry", ele);
          // },
          oninput: (e) => {
            const value = (e.currentTarget as HTMLInputElement).value;
            state["value" + i] = value;
            // update all binded subscribe values
            toUpdate();
          },
        });
      },
    }),

    For("div", {
      each: () => {
        const v = Number(state["value0"]);
        return v > 25000 ? 25000 : v;
      },
      dog: "aaaaa",
      ["data-length"]: async (ele: Element) => {
        await new Promise((res) => setTimeout(res, 1000));
        return ele.children.length;
      },
      render: (i, len) => {
        const area = () => i % (len() / 500);
        return Ele("div", {
          // bind subscribe value
          textContent: () => state["value" + area()] || "empty",
          ["data-i"]: i,
        });
      },
    }),
  ],
});

Ele(app, {
  "data-base": "right",
});

document.body.append(app);
