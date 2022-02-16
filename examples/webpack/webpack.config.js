const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { unpluginUploadCDN, OSS } = require("unplugin-upload-cdn");
const oss = new OSS({});
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src", to: "dest" }],
    }),
    unpluginUploadCDN.webpack({
      dir: "./dist",
      useVersion: true,
      existCheck: true,
      provider: oss,
    }),
  ],
};
