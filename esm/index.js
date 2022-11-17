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
var updateNextElements = () => {
  nextElements.forEach((e) => {
    if (e.__x_subscrib) {
      const keys = Object.keys(e.__x_subscrib);
      keys.forEach((k) => {
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
  nextElements.clear();
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
var lastElementSize = 0;
function fixFullTimeout() {
  if (lastElementSize < 3e3) {
    return 17;
  }
  return lastElementSize / 3e3 * 17;
}
function toUpdate(priority = document.body, options = {}) {
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

// lib/onMount.ts
var observeOption = {
  childList: true,
  subtree: true
};
var onMoountWeak = /* @__PURE__ */ new WeakMap();
var onCleanupWeak = /* @__PURE__ */ new WeakMap();
var onEntryWeak = /* @__PURE__ */ new WeakMap();
function onMount(target, callback) {
  if (onMoountWeak.has(target)) {
    const fns = onMoountWeak.get(target);
    fns.push(callback);
    return;
  }
  onMoountWeak.set(target, [callback]);
  const observer = new MutationObserver((_e) => {
    if (document.contains(target)) {
      observer.disconnect();
      const fns = onMoountWeak.get(target);
      if (fns) {
        fns.forEach((fn) => fn(target));
      }
      onMoountWeak.delete(target);
    }
  });
  observer.observe(document, observeOption);
}
function onCleanup(target, callback) {
  if (onCleanupWeak.has(target)) {
    const fns = onCleanupWeak.get(target);
    fns.push(callback);
    return;
  }
  onCleanupWeak.set(target, [callback]);
  onMount(target, () => {
    const observer = new MutationObserver(() => {
      if (!document.contains(target)) {
        observer.disconnect();
        const fns = onCleanupWeak.get(target);
        if (fns) {
          fns.forEach((fn) => fn(target));
        }
        onCleanupWeak.delete(target);
      }
    });
    observer.observe(document, observeOption);
  });
}
var onEntry = (target, callback, { minHeight = "50px", root } = {}) => {
  if (onEntryWeak.has(target)) {
    const fns = onEntryWeak.get(target);
    fns.push(callback);
    return;
  }
  onEntryWeak.set(target, [callback]);
  onMount(target, () => {
    if (!target.style.minHeight) {
      target.style.minHeight = minHeight;
    }
    if (!target.getAttribute("data-lazy")) {
      target.setAttribute("data-lazy", "1");
      const observer = new IntersectionObserver((e) => {
        e.forEach((ent) => {
          target.setAttribute("data-lazy", "2");
          if (ent.isIntersecting) {
            observer.disconnect();
            const fns = onEntryWeak.get(target);
            if (fns) {
              fns.forEach((fn) => fn(ent));
            }
            onEntryWeak.delete(target);
          }
        });
      }, { root, rootMargin: window.innerHeight / 2 + "px" });
      observer.observe(target);
      onCleanup(target, () => {
        observer.disconnect();
      });
    }
  });
};

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
      if (ele.setAttribute) {
        if (typeof v === "function" && !/^on/.test(k)) {
          if (k === "ref") {
            v(ele);
            return;
          }
          bindSubscrib(ele, k, v);
          return;
        }
        if (k === "onMount") {
          onMount(ele, v);
          return;
        }
        if (k === "onCleanup") {
          onCleanup(ele, v);
          return;
        }
        if (k === "onEntry") {
          onEntry(ele, v);
          return;
        }
      }
      setAttr(ele, k, v);
    });
  }
  return ele;
}
window.JSX_ELE = Ele;

// lib/for.ts
function For(tag, params) {
  const { each, render, ...rest } = params;
  const out = Ele(tag, rest);
  if (typeof each === "function") {
    bindSubscrib(out, "__update_for", (ele) => {
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
        for (let i = lastL; i < nowL; i++) {
          eles.push(render(i, each));
        }
        ele.append(...eles);
      } else {
        const removes = [];
        for (let i = nowL; i < lastL; i++) {
          const e = ele.childNodes.item(i);
          if (e) {
            removes.push(e);
          }
        }
        removes.forEach((e) => e.remove());
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
function Show({
  when,
  render
}) {
  if (!when) {
    return createEmpty();
  }
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
export {
  Ele,
  For,
  Show,
  attributeKeys,
  bindSubscrib,
  createEmpty,
  onCleanup,
  onEntry,
  onMount,
  setAttr,
  tagToElement,
  toUpdate
};
//# sourceMappingURL=index.js.map
