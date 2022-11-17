declare module "https://*";

// Second, list out all your dependencies. For every URL, you must map it to its local module.
declare module "https://cdn.skypack.dev/esframe" {
  export * from "../lib";
}
