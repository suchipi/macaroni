const util = require("util");

module.exports = (...args) => {
  console.error("rule inputs:", util.inspect(args, { depth: null }));
  const [input, api] = args;
  return input.content;
};
