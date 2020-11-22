const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: ["PowerSDK"],
            },
          },
          { loader: "babel-loader" },
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
