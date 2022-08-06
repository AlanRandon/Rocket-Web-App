import esbuild from "gulp-esbuild";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import gulp from "gulp";
import htmlMinifier from "gulp-htmlmin";
import rename from "gulp-rename";

const { src, dest, watch, series } = gulp;
const paths = {
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

export function scripts() {
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

export function styles() {
  return src(paths.styles.src)
    .pipe(
      postcss([tailwindcss(paths.styles.config), autoprefixer(), cssnano()])
    )
    .pipe(rename((path) => (path.extname = ".css.hbs")))
    .pipe(dest(paths.styles.dest));
}

export function templates() {
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

export const build = series(scripts, templates, styles);

export default () => {
  build((error) => {
    if (error) console.error(`Error: ${error}`);
  });
  watch(paths.scripts.src, scripts);
  watch(paths.styles.src, styles);
  watch(paths.templates.src, series(templates, styles));
};
