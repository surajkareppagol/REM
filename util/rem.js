const ParserMD = require("./Parser");
const InsertMD = require("./Insert");

async function markdownToHTML(mdPath) {
  const tags = await ParserMD(mdPath);
  return InsertMD(tags);
}

module.exports = markdownToHTML;
