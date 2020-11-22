const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: ["PowerSDK"],
            },
          },
          {
            loader: "babel-loader",
            // some of this may be redundant
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    targets: {
                      chrome: "58",
                      ie: "11",
                    },
                  },
                ],
                "@babel/preset-typescript",
              ],
              plugins: [
                "@babel/plugin-transform-async-to-generator",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-modules-commonjs",
              ],
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map",
  resolve: {
    extensions: ["*", ".ts"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    library: "PowerSDK",
    libraryExport: "default",
    libraryTarget: "umd",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
  },
};
