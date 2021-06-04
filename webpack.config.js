const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const path = require("path");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  mode: IS_PRODUCTION ? "production" : "development",
  bail: IS_PRODUCTION,
  entry: [path.join(__dirname, "src", "index.tsx")],
  // devServer: {
  //   open: true, // 自动打开浏览器
  //   overlay: true, // 全屏显示报错
  //   port: 9999, // 自定义端口
  //   hot: true,
  // },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: IS_PRODUCTION
      ? "static/js/[name].[contenthash:8].js"
      : "state/js/bundle.js",
    chunkFilename: IS_PRODUCTION
      ? "static/js/[name].[contenthash:8].js"
      : "state/js/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign({
        inject: true,
        template: path.resolve("public/index.html"),
      })
    ),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "source-map",
};
