import demo, { COS } from "../../dist/index";

const cos = new COS({
  Bucket: "demo-1256203566",
  Region: "ap-nanjing",
  SecretId: "AKID72hcHhUoX2sTv7Ho35dkmV0OhUDieyxh",
  SecretKey: "sVxDFqDQO7iCWgeP0SfWLwNadWE2b0AC",
  cosBaseDir: "demo",
  projectDir: "aaaa",
  existCheck: true,
});

export default {
  input: "src/main.js",
  output: {
    file: "./dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    demo.rollup({
      provider: cos,
      ignore: ["!**/a.js"],
      dir: "dist",
    }),
  ],
};
