/* PARSER */

/* NOTES - Clear all variable at end. */

const fs = require("fs");
const readline = require("readline");

/* FOR CODE FENCE */
let isCodeFence = false;
let codeFence = "";

function getHTML(line) {
  let characters, symbol;

  /* HEADING */
  if (line.includes("#")) {
    characters = line.split("#").length - 1;
    return `<h${characters} class=rem-h${characters}>${line.slice(
      characters + 1
    )}</h${characters}>`;
  }

  /* CODE */
  if (line.includes("`") && line.split("`").length - 1 == 2) {
    return `<span class="rem-span">${line.slice(1, -1)}</span>`;
  }

  /* BOLD, ITALICS */
  if (line && (line.includes("*") || line.includes("_"))) {
    if (line.includes("*")) symbol = "*";
    if (line.includes("_")) symbol = "_";

    characters = line.split(symbol).length - 1;

    if (characters / 2 == 1)
      return `<p class="rem-p"><em class="rem-em">${line.slice(
        1,
        -1
      )}</em></p>`;
    if (characters / 2 == 2)
      return `<p class="rem-p"><strong class="rem-strong">${line.slice(
        2,
        -2
      )}</strong></p>`;
    if (characters / 2 == 3)
      return `<p class="rem-p"><strong class="rem-strong"><em class="rem-em">${line.slice(
        3,
        -3
      )}</em></strong></p>`;
  }

  /* BLOCKQUOTE */
  if (line && line.includes(">")) {
    return `<blockquote class="rem-blockquote">${line.slice(2)}</blockquote>`;
  }

  /* CODE FENCE */
  if (line && line.includes("```")) {
    if (!isCodeFence) {
      isCodeFence = true;
      codeFence += "\n";
      return;
    }

    if (isCodeFence) {
      isCodeFence = false;
      return `<code class="rem-code">${codeFence}</code>`;
    }
  }

  /* HORIZONTAL RULE */
  if (line && (line.includes("---") || line.includes("***"))) {
    return `<hr/>`;
  }

  /* LINKS */
  if (line && line.includes("[") && line.includes("]") && !line.includes("!")) {
    return `<a class="rem-a" href="${line.slice(
      line.indexOf("(") + 1,
      line.indexOf(")")
    )}">${line.slice(line.indexOf("[") + 1, line.indexOf("]"))}</a>`;
  }

  /* IMAGES */
  if (line && line.includes("[") && line.includes("]") && line.includes("!")) {
    return `<img class="rem-img" src="${line.slice(
      line.indexOf("(") + 1,
      line.indexOf(")")
    )}" alt="${line.slice(line.indexOf("[") + 1, line.indexOf("]"))}"/>`;
  }

  /* PARAGRAPH AND CODE FENCE */
  if (line) {
    if (isCodeFence) {
      codeFence += `${line}\n`;
      return;
    }

    return `<p class="rem-p">${line}</p>`;
  }

  /* LINE BREAK AND BLANK LINE */
  if (!line) {
    return;
  }
}

async function ParserMD(mdPath) {
  try {
    const tags = [];
    const readLine = readline.createInterface({
      input: fs.createReadStream(mdPath),
      crlfDelay: Infinity,
    });

    for await (const line of readLine) {
      tags.push(getHTML(line));
    }

    codeFence = "";
    return tags;
  } catch (error) {
    console.log(`Something Went Wrong (Parser) : Error ${error}`);
  }
}

module.exports = ParserMD;
