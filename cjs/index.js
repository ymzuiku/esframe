var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  Ele: () => Ele,
  For: () => For,
  Show: () => Show,
  attributeKeys: () => attributeKeys,
  bindSubscrib: () => bindSubscrib,
  createEmpty: () => createEmpty,
  setAttr: () => setAttr,
  tagToElement: () => tagToElement,
  toUpdate: () => toUpdate
});

// lib/BootMap.ts
var BootMap = class {
  weak = /* @__PURE__ */ new WeakMap();
  map = /* @__PURE__ */ new Map();
  set = (key, value) => {
    if (typeof key !== "object") {
      this.map.set(key, value);
    } else {
      this.weak.set(key, value);
    }
  };
  get = (key) => {
    if (typeof key !== "object") {
      return this.map.get(key);
    }
    return this.weak.get(key);
  };
  has = (key) => {
    if (typeof key !== "object") {
      this.map.has(key);
    } else {
      this.weak.has(key);
    }
  };
  delete = (key) => {
    if (typeof key !== "object") {
      return this.map.delete(key);
    } else {
      this.weak.delete(key);
    }
  };
};

// lib/update.ts
function isSvg(ele) {
  if (ele.tagName === "svg" || ele.ownerSVGElement) {
    return true;
  }
  return false;
}
var attributeKeys = {
  autofocus: true,
  role: true,
  viewBox: true,
  disabled: true,
  class: true
};
var setAttributeKeys = {};
function setAttr(ele, key, value) {
  if (Array.isArray(value)) {
    ele[key](...value);
    return;
  }
  if (typeof value === "object") {
    Object.assign(ele[key], value);
    return;
  }
  if (!ele.__lastAttr) {
    ele.__lastAttr = {};
  }
  if (ele.__lastAttr[key] === value) {
    return;
  }
  ele.__lastAttr[key] = value;
  if (ele.setAttribute && (setAttributeKeys[key] || attributeKeys[key] || /-/.test(key) || isSvg(ele))) {
    setAttributeKeys[key] = true;
    if (value === void 0 || value === null) {
      ele.removeAttribute(key);
    } else {
      ele.setAttribute(key, value);
    }
    return;
  }
  ele[key] = value;
}
function bindSubscrib(ele, key, fn, ignoreAutoRun) {
  ele.setAttribute("data-x-subscrib", "");
  if (!ele.__x_subscrib) {
    ele.__x_subscrib = {};
  }
  ele.__x_subscrib[key] = fn;
  if (!ignoreAutoRun) {
    if (/^(__update)/.test(key)) {
      fn(ele, key);
      return;
    }
    Promise.resolve(fn(ele, key)).then((value) => {
      setAttr(ele, key, value);
    });
  }
}
var nextElements = /* @__PURE__ */ new Set();
var nowId = "";
var updateNextElements = (id) => {
  if (nowId !== id) {
    return;
  }
  nextElements.forEach((e) => {
    if (nowId !== id) {
      return;
    }
    requestAnimationFrame(() => {
      if (nowId !== id) {
        return;
      }
      if (e.__x_subscrib) {
        const keys = Object.keys(e.__x_subscrib);
        keys.forEach((k) => {
          if (nowId !== id) {
            return;
          }
          const fn = e.__x_subscrib[k];
          if (/^(__update)/.test(k)) {
            fn(e, k);
            return;
          }
          Promise.resolve(fn(e, k)).then((value) => {
            setAttr(e, k, value);
          });
        });
      }
    });
    nextElements.delete(e);
  });
};
function updateOne(ele) {
  if (ele.hasAttribute("data-x-subscrib")) {
    nextElements.add(ele);
  }
  const eles = ele.querySelectorAll("[data-x-subscrib]");
  eles.forEach((e) => {
    nextElements.add(e);
  });
}
var filterEvents = new BootMap();
var fullUpdateEvents;
function toUpdate(priority = document.body, options = {}) {
  if (priority !== null) {
    let id = Math.random().toString();
    nowId = id;
    const lastRaf = filterEvents.get(priority) || 0;
    if (lastRaf) {
      cancelAnimationFrame(lastRaf);
    }
    const nextRef = requestAnimationFrame(() => {
      if (typeof priority === "string") {
        document.body.querySelectorAll(priority).forEach(updateOne);
      } else if (Array.isArray(priority)) {
        priority.forEach(updateOne);
      } else {
        updateOne(priority);
      }
      updateNextElements(id);
      filterEvents.delete(priority);
    });
    filterEvents.set(priority, nextRef);
  }
  if (!options.ignoreSupplement && priority !== document.body) {
    if (fullUpdateEvents) {
      clearTimeout(fullUpdateEvents);
      fullUpdateEvents = null;
    }
    fullUpdateEvents = setTimeout(() => {
      updateOne(document.body);
      updateNextElements(nowId);
    }, 250);
  }
}

// lib/ele.ts
function tagToElement(tag) {
  let ele;
  if (typeof tag === "string") {
    ele = document.createElement(tag);
  } else {
    ele = tag;
  }
  return ele;
}
function Ele(tag, params) {
  const ele = tagToElement(tag);
  if (params) {
    const keys = Object.keys(params);
    keys.forEach((k) => {
      const v = params[k];
      if (typeof v === "function" && ele.setAttribute && !/^on/.test(k)) {
        bindSubscrib(ele, k, v);
        return;
      }
      setAttr(ele, k, v);
    });
  }
  return ele;
}

// lib/for.ts
function For(tag, params) {
  const { each, render, ...rest } = params;
  const out = Ele(tag, rest);
  if (typeof each === "function") {
    bindSubscrib(out, "__update_for", (ele) => {
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
    });
  } else {
    const eles = [];
    for (let i = 0; i < each; i++) {
      eles.push(render(i, () => each));
    }
    out.append(...eles);
  }
  return out;
}

// lib/show.ts
function createEmpty() {
  const span = document.createElement("span");
  span.style.all = "none";
  return span;
}
function Show(when, render) {
  const base = createEmpty();
  if (typeof when === "function") {
    const createShowBind = (bindEle) => {
      bindSubscrib(bindEle, "__update_show", (ele) => {
        Promise.resolve(when()).then((v) => {
          if (v === ele.__lastShow) {
            return;
          }
          const nextEle = v ? render() : createEmpty();
          createShowBind(nextEle);
          ele.replaceWith(nextEle);
          ele.__lastShow = v;
        });
      }, true);
    };
    createShowBind(base);
  }
  return base;
}
module.exports = __toCommonJS(lib_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Ele,
  For,
  Show,
  attributeKeys,
  bindSubscrib,
  createEmpty,
  setAttr,
  tagToElement,
  toUpdate
});
//# sourceMappingURL=index.js.map
