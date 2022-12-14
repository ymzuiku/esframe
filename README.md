# esframe

## Why esframe?

When you want use native-js create some Element, we need encapsulation some tools method, like set elements params, createElement tree, and update element. listening element append DOM mount, or remove element.

esframe is simplify do this. like framework, but keep in native element.

you can use esframe like framework or use esframe only create some elements in tiny task.

## Features

- Tiny, only 3.5KB in gzip
- Zero dependency
- bundle less, like Flutter element tree creator.
- No diff dom
- No proxy, No defineProperty
- No top framework life cycle
- No useState, no createSignal, just `toUpdate` all

## Install

Use npm:

```sh
npm/pnpm/yarn install "esframe"
```

Use CDN:

```html
<script type="module">
  import { Ele } from "https://cdn.skypack.dev/esframe";
  const app = Ele("div");
  document.body.append(app);
</script>
```

## Ele, toUpdate example

```ts
import { Ele, toUpdate } from "esframe";

let num = 0;

const app = Ele("div", {
  append: [
    Ele("h1", { textContent: "Touch the button, add the num:" }),
    // function value is auto subscribe
    Ele("p", { textContent: () => num }),
    Ele("button", {
      onclick: () => {
        num++;
        // update all function values
        toUpdate();
      },
      textContent: "Touch me",
    }),
  ],
});

document.body.append(app);
```

## For, Show Example

- `For` is render dynamic length children Element
- `Show` is render Element or render empty Element

```ts
import { For, Show, Ele, toUpdate } from "esframe";

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
    Show({
      when: () => Date.now() % 3 !== 0,
      render: () => {
        return Ele("span", { textContent: "show temp" });
      },
    }),
    For("div", {
      each: () => {
        const v = Number(state["value0"]);
        return v > 15000 ? 15000 : v;
      },
      render: (i, len) => {
        const area = () => i % (len() / 5);
        return Ele("input", {
          // bind subscribe value
          value: () => state["value" + area()],
          ["data-info"]: "info",
          oninput: (e) => {
            const value = (e.currentTarget as HTMLInputElement).value;
            state["value" + i] = value;
            // update all binded subscribe values
            toUpdate();
          },
        });
      },
    }),
  ],
});

document.body.append(app);
```

## ref, onMount, onCleanup

Use element life cycle.

- ref: when element before append in DOM
- onMount: when element appended in DOM
- onCleanup: when element removed
- onEntry: when element entry in screen, only run once

> Tip: the `onMount`, `onCleanup`, `onEntry` is slowly, because esframe no have top framework register element's life cycle, if you don't need element'life, please use `ref`.

```ts
import { Ele, toUpdate } from "esframe";

let num = 0;

const app = Ele("div", {
  ref: (ele) => {
    console.log("ref", ele);
  },
  onMount: (ele) => {
    console.log("onMount", ele);
  },
  onCleanup: (ele) => {
    console.log("onCleanup", ele);
  },
  onEntry: (ele) => {
    console.log("onEntry", ele);
  },
});

document.body.append(app);
```

## Use native-js element

Because esframe no have top framework register element's life cycle, esframe elements is only native-js elements.

we can set native-js elements all esframe feature:

```ts
const button = document.createElement("button");

Ele(button, {
  ref: (ele) => {
    console.log("ref", ele);
  },
  onMount: (ele) => {
    console.log("onMount", ele);
  },
  textContent: () => new Date().toString(),
});

document.body.append(button);
```

## toUpdate detail

toUpdate allways update full page to last state, full page update can help your reduce some state's bug.

- `toUpdate()`: (Recommend) update full page element
- `toUpdate(element)`: Can update first the element and the element children, and update all when idle

## TS vs TSX

### Why no use TSX?

Because if you need use esframe in react \ solid-js \ vue(jsx), the jsx parse is use in React \ h, JSX framework is to many. esframe staring point is a tools methods.

### Discard use TSX, are you real?

TSX(JSX) is less code, but pure Typescript is acceptable too.

This page is same code in TS and TSX, TSX is only 60% pure TS codes.

![](./ts-vs-tsx.png)

Flutter is only use pure object tree, is only preference style, we love it.
