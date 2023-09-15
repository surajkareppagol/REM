const ParserMD = require("./util/parser");
const InsertMD = require("./util/insert");

async function markdownToHTML() {
  const tags = await ParserMD("./md/sample.md");
  InsertMD(tags);
}

markdownToHTML();
