// gulpfile.ts
import esbuild from "./node_modules/gulp-esbuild/index.mjs";
import postcss from "./node_modules/gulp-postcss/index.js";
import autoprefixer from "./node_modules/autoprefixer/lib/autoprefixer.js";
import cssnano from "./node_modules/cssnano/src/index.js";
import tailwindcss from "./node_modules/tailwindcss/lib/index.js";
import gulp from "./node_modules/gulp/index.js";
import htmlMinifier from "./node_modules/gulp-htmlmin/index.js";
import rename from "./node_modules/gulp-rename/index.js";
var { src, dest, watch, series } = gulp;
var paths = {
  scripts: {
    src: "typescript/**/*.ts",
    entrypoint: "typescript/index.ts",
    dest: "../templates",
  },
  styles: {
    src: "*.css",
    dest: "../templates",
    config: "tailwind.config.cjs",
  },
  templates: {
    src: "**/*.hbs",
    dest: "../templates",
  },
};
function scripts() {
  return src(paths.scripts.entrypoint)
    .pipe(
      esbuild({
        bundle: true,
        minify: true,
        target: ["chrome58", "firefox57", "safari11", "edge16"],
        outfile: "bundle.js",
      })
    )
    .pipe(rename((path) => (path.extname = ".js.hbs")))
    .pipe(dest(paths.scripts.dest));
}
function styles() {
  return src(paths.styles.src)
    .pipe(
      postcss([tailwindcss(paths.styles.config), autoprefixer(), cssnano()])
    )
    .pipe(rename((path) => (path.extname = ".css.hbs")))
    .pipe(dest(paths.styles.dest));
}
function templates() {
  return src(paths.templates.src)
    .pipe(
      htmlMinifier({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        ignoreCustomFragments: [/\{\{[\s\S]*?\}\}/gm],
      })
    )
    .pipe(dest(paths.templates.dest));
}
var build = series(scripts, templates, styles);
var gulpfile_default = () => {
  build((error) => {
    if (error) console.error(`Error: ${error}`);
  });
  watch(paths.scripts.src, scripts);
  watch(paths.styles.src, styles);
  watch(paths.templates.src, series(templates, styles));
};
export { build, gulpfile_default as default, scripts, styles, templates };
