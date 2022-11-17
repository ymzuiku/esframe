# esframe

- Like Flutter element tree creator
- Zero dependency
- No diff dom
- No proxy, No defineProperty
- No top framework life cycle
- No useState, no createSignal, just `toUpdate` all

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
          // bind subscribe value
          value: () => state["value" + area()],
          dog: "aaa",
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
