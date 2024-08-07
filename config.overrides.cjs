const path = require("path");

module.exports = {
  webpack: (config) => {
    config.output = {
      ...config.output,
      path: path.resolve(__dirname, "/src/renderer/index.html"), // 원하는 경로로 변경
    };
    return config;
  },
};
