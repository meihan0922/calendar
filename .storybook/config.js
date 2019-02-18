import { configure } from "@storybook/react";
const req = require.context("../src/stories/", false, /\.stories\.js$/);

function loadStories() {
  req.keys().map(req);
}

// function loadStories() {
//   require("../src/stories/index.js");
//   // You can require as many stories as you need.
// }

configure(loadStories, module);
