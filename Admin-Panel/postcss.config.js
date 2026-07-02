import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

const normalizePrintColorAdjust = () => ({
  postcssPlugin: "normalize-print-color-adjust",
  Declaration(declaration) {
    if (declaration.prop === "color-adjust") {
      declaration.prop = "print-color-adjust"
    }
  },
})

normalizePrintColorAdjust.postcss = true

export default {
  plugins: [normalizePrintColorAdjust(), tailwindcss(), autoprefixer()],
}
