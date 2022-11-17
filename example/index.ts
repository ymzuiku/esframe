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
  value0: "500",
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
    Show({
      when: () => Date.now() % 3 !== 0,
      render: () => {
        return Ele("span", { textContent: "show temp" });
      },
    }),
    Ele("div", { textContent: "hi" }),
    For("div", {
      each: () => {
        const v = Number(state["value0"]) / 100;
        return v > 25000 ? 25000 : v;
      },
      render: (i, len) => {
        console.log("__debug__i", i);
        const area = () => i % (len() / 5);
        return Ele("input", {
          // bind subscribe value
          value: () => state["value" + area()],
          ["data-i"]: i,
          oninput: (e) => {
            const value = (e.currentTarget as HTMLInputElement).value;
            state["value" + i] = value;
            console.log("11 state", i, state["value" + i]);
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
