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
  value0: "200",
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
        const v = Number(state["value0"]);
        return v > 15000 ? 15000 : v;
      },
      render: (i, len) => {
        const area = () => i % (len() / 5);
        return Ele("input", {
          value: () => state["value" + area()],
          dog: "aaa",
          oninput: (e) => {
            const value = (e.currentTarget as HTMLInputElement).value;
            state["value" + i] = value;
            toUpdate();
          },
        });
      },
    }),
  ],
});

document.body.append(app);
