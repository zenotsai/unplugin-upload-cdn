// import demo, { COS } from "unplugin-upload-cdn";
import { unpluginUploadCDN, COS } from "unplugin-upload-cdn";

export default {
  input: "src/main.js",
  output: {
    file: "./dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    unpluginUploadCDN.rollup({
      dir: "dist",
      provider: cos,
    }),
  ],
};
