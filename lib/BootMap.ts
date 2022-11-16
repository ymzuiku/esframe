export class BootMap<K, V> {
  weak = new WeakMap();
  map = new Map();
  set = (key: K, value: V) => {
    if (typeof key !== "object") {
      this.map.set(key, value);
    } else {
      this.weak.set(key as object, value);
    }
  };
  get = (key: K) => {
    if (typeof key !== "object") {
      return this.map.get(key);
    }
    return this.weak.get(key as object);
  };
  has = (key: K) => {
    if (typeof key !== "object") {
      this.map.has(key);
    } else {
      this.weak.has(key as object);
    }
  };
  delete = (key: K) => {
    if (typeof key !== "object") {
      return this.map.delete(key);
    } else {
      this.weak.delete(key as object);
    }
  };
}
