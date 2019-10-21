const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC_ROOT = path.resolve(__dirname, "src");
const DIST_ROOT = path.resolve(__dirname, "dist");

module.exports = {
  entry: path.resolve(SRC_ROOT, "js/index.js"),
  output: {
    path: DIST_ROOT,
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_ROOT, "index.html")
    })
  ]
};
