const { build } = require("esbuild");

const pkg = require("./package.json");
const dep = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
};

const isDev = true;

build({
  entryPoints: ["lib/index.ts"],
  bundle: true,
  format: "cjs",
  external: Object.keys(dep),
  outfile: "cjs/index.js",
  minify: !isDev,
  platform: "node",
  watch: isDev,
  sourcemap: isDev,
  loader: {
    ".svg": "dataurl",
  },
  logLevel: "info",
}).catch(() => process.exit(1));

build({
  entryPoints: ["lib/index.ts"],
  bundle: true,
  format: "esm",
  external: Object.keys(dep),
  outfile: "esm/index.js",
  minify: !isDev,
  platform: "node",
  watch: isDev,
  sourcemap: isDev,
  loader: {
    ".svg": "dataurl",
  },
  logLevel: "info",
}).catch(() => process.exit(1));

build({
  entryPoints: ["example/index.ts"],
  bundle: true,
  format: "esm",
  external: Object.keys(dep),
  outfile: "example/index.js",
  minify: true,
  watch: isDev,
  platform: "node",
  sourcemap: isDev,
  loader: {
    ".svg": "dataurl",
  },
  logLevel: "info",
}).catch(() => process.exit(1));
