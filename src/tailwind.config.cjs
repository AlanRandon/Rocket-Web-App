const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("no-placeholder", "&:not(:placeholder-shown) ");
      addVariant("peer-no-placeholder", ".peer:not(:placeholder-shown) ~ &");
      addVariant("not", ":not(&)");
      addVariant("noop", ":not(:not(&))");
    }),
  ],
  content: ["**/*.hbs", "**/*.ts"],
  theme: {
    extend: {
      spacing: {
        input: "0.75em",
      },
      colors: {
        transparent: "transparent",
        // For impact points (e.g. btns)
        primary: colors.cyan,
        // For gradients
        "primary-analogous": colors.green,
        // For large blocks
        base: colors.zinc,
      },
      transitionDuration: {
        input: "100ms",
      },
      backgroundImage: {
        "random-img": "url(https://picsum.photos/536/354)",
        "waves": "url(https://picsum.photos/id/1041/367/267?blur)"
      },
    },
  },
};
