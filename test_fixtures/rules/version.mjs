export default (input, api) => {
  return input.content.replace(/#VERSION/g, '"v1.2.3"');
};
