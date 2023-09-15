const fs = require("fs");
const readline = require("readline");
const path = require("path");

/* HTML File */
let html = "";

function insertIntoHTML(line, tags) {
  if (!line) {
    for (const htmlLine of tags) {
      if (htmlLine == undefined) continue;
      html += `    ${htmlLine}\n`;
    }
  }
  html += `${line}\n`;
}

async function InsertMD(tags) {
  try {
    const readLine = readline.createInterface({
      input: fs.createReadStream(
        path.join(__dirname, "../public/template.txt")
      ),
      crlfDelay: Infinity,
    });

    for await (const line of readLine) {
      insertIntoHTML(line, tags);
    }

    fs.writeFile(path.join(__dirname, "../public/rem.html"), html, (error) => {
      if (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.log(`Something Went Wrong: Error ${error}`);
  }
}

module.exports = InsertMD;
