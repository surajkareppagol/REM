const fs = require("fs");
const readline = require("readline");

const tags = [];

/* For Code Fence */
let isCodeFence = false;
let codeFence = "";

function getHTML(line) {
  let characters, symbol;

  /* Heading */
  if (line.includes("#")) {
    characters = line.split("#").length - 1;
    return `<h${characters}>${line.slice(characters + 1)}</h${characters}>`;
  }

  /* Code */
  if (line.includes("`") && line.split("`").length - 1 == 2) {
    return `<span>${line.slice(1, -1)}</span>`;
  }

  /* Bold, Italics */
  if (line && (line.includes("*") || line.includes("_"))) {
    if (line.includes("*")) symbol = "*";
    if (line.includes("_")) symbol = "_";

    characters = line.split(symbol).length - 1;

    if (characters / 2 == 1) return `<p><em>${line.slice(1, -1)}</em></p>`;
    if (characters / 2 == 2)
      return `<p><strong>${line.slice(2, -2)}</strong></p>`;
    if (characters / 2 == 3)
      return `<p><strong><em>${line.slice(3, -3)}</em></strong></p>`;
  }

  /* Blockquotes */
  if (line && line.includes(">")) {
    return `<blockquote>${line.slice(2)}</blockquote>`;
  }

  /* Code Fence */
  if (line && line.includes("```")) {
    if (!isCodeFence) {
      isCodeFence = true;
      codeFence += "\n";
      return;
    }

    if (isCodeFence) {
      isCodeFence = false;
      return `<code>${codeFence}</code>`;
    }
  }

  /* Horizontal Line */
  if (line && (line.includes("---") || line.includes("***"))) {
    return `<hr/>`;
  }

  /* Links */
  if (line && line.includes("[") && line.includes("]") && !line.includes("!")) {
    return `<a href="${line.slice(
      line.indexOf("(") + 1,
      line.indexOf(")")
    )}">${line.slice(line.indexOf("[") + 1, line.indexOf("]"))}</a>`;
  }

  /* Images */
  if (line && line.includes("[") && line.includes("]") && line.includes("!")) {
    return `<img src="${line.slice(
      line.indexOf("(") + 1,
      line.indexOf(")")
    )}" alt="${line.slice(line.indexOf("[") + 1, line.indexOf("]"))}"/>`;
  }

  /* Paragraph And Code Fence */
  if (line) {
    if (isCodeFence) {
      codeFence += `${line}\n`;
      return;
    }

    return `<p>${line}</p>`;
  }

  /* Line Break Or Blank Line */
  if (!line) {
    return;
  }
}

async function ParserMD(mdPath) {
  try {
    const readLine = readline.createInterface({
      input: fs.createReadStream(mdPath),
      crlfDelay: Infinity,
    });

    for await (const line of readLine) {
      tags.push(getHTML(line));
    }

    return tags;
  } catch (error) {
    console.log(`Something Went Wrong: Error ${error}`);
  }
}

module.exports = ParserMD;
