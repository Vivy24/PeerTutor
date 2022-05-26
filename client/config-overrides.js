const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    path: require.resolve("path-browserify"),
    url: require.resolve("url"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
