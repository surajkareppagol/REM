/* INSERT */

/* NOTES - Clear all variable at end. */

const fs = require("fs");
const readline = require("readline");

const basePath = `/${__dirname.split("/").slice(1, -1).join("/")}`;

/* HTML FILE */
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
    html = "";

    const readLine = readline.createInterface({
      input: fs.createReadStream(`/${basePath}/public/txt/template.txt`),
      crlfDelay: Infinity,
    });

    for await (const line of readLine) {
      insertIntoHTML(line, tags);
    }

    fs.writeFile(`/${basePath}/public/html/rem.html`, html, (error) => {
      if (error) {
        console.error(error);
      }
    });

    return `/${basePath}/public/html/rem.html`;
  } catch (error) {
    console.log(`Something Went Wrong (Insert) : Error ${error}`);
  }
}

module.exports = InsertMD;
