const convertNodeToCursor = (input) => {
  return Buffer.from(input).toString("base64");
};

const convertCursorToNodeId = (input) => {
  return Buffer.from(input, "base64").toString("utf-8");
};

module.exports = {
  convertNodeToCursor,
  convertCursorToNodeId,
};
