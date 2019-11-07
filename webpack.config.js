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
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      template: "!!html-loader!" + path.resolve(SRC_ROOT, "index.html")
    })
  ]
};
