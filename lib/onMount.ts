const observeOption = {
  childList: true,
  subtree: true,
};

const onMoountWeak = new WeakMap<Element, Function[]>();
const onCleanupWeak = new WeakMap<Element, Function[]>();
const onEntryWeak = new WeakMap<Element, Function[]>();

export function onMount<T extends Element>(
  target: T,
  callback: (ele: T) => any
) {
  if (onMoountWeak.has(target)) {
    const fns = onMoountWeak.get(target)!;
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

export function onCleanup<T extends Element>(
  target: T,
  callback: (ele: T) => any
) {
  if (onCleanupWeak.has(target)) {
    const fns = onCleanupWeak.get(target)!;
    fns.push(callback);
    return;
  }

  onCleanupWeak.set(target, [callback]);

  // 当元素插入到页面后，才开始监听是否移除
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

export interface LazyEnterOptions {
  // 随着某个元素的消亡而取消订阅
  minHeight?: string;
  root?: Element;
}

export const onEntry = <T extends Element>(
  target: T,
  callback: (target: T, entry: IntersectionObserverEntry) => any,
  { minHeight = "50px", root }: LazyEnterOptions = {}
) => {
  if (onEntryWeak.has(target)) {
    const fns = onEntryWeak.get(target)!;
    fns.push(callback);
    return;
  }

  onEntryWeak.set(target, [callback]);

  onMount(target, () => {
    // let isNeedRemoveMinHeight = false;
    if (!(target as any).style.minHeight) {
      // isNeedRemoveMinHeight = true;
      (target as any).style.minHeight = minHeight;
    }

    if (!target.getAttribute("data-lazy")) {
      target.setAttribute("data-lazy", "1");
      const observer = new IntersectionObserver(
        (e) => {
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
        },
        { root, rootMargin: window.innerHeight / 2 + "px" }
      );

      observer.observe(target);
      onCleanup(target, () => {
        observer.disconnect();
      });
    }
  });
};
