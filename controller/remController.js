const ParserMD = require("../util/Parser");
const InsertMD = require("../util/Insert");

async function markdownToHTML() {
  const tags = await ParserMD("./md/sample.md");
  InsertMD(tags);
}

exports.parseMarkdown = (req, res) => {
  markdownToHTML();
};
