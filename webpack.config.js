const path = require("path");

module.exports = {
  mode: "development", // or 'production'
  entry: ["./JavaScript/mqtt-receiver.js","./JavaScript/mqtt-sender.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      mqtt: path.resolve(__dirname, "node_modules/mqtt/dist/mqtt.min.js"),
    },
  },
};