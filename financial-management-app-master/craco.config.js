const Dotenv = require("dotenv-webpack");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: [],
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
          os: require.resolve("os-browserify/browser"),
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          process: require.resolve("process/browser"),
          vm: require.resolve("vm-browserify"),
        },
      },
    },
  },
};
