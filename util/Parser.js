/**************************************/
/* Parser.js */
/**************************************/

const fs = require("fs");
const readline = require("readline");

let tagType = "none";
let tagValue = "";
let isCodeFence = false;
let codeFence = "";

/**************************************/
/* MAIN UTILS */
/**************************************/

function getCode(line) {
  return getTagAndValue(line, "`", '<span class="rem-span">', "</span>", 1);
}

function getBoldAndItalics(line) {
  if (line.includes("***")) symbol = "***";
  else if (line.includes("___")) symbol = "___";
  else if (line.includes("**")) symbol = "**";
  else if (line.includes("__")) symbol = "__";
  else if (line.includes("*")) symbol = "*";
  else if (line.includes("_")) symbol = "_";

  if (symbol === "*" || symbol === "_") {
    return getTagAndValue(line, symbol, '<em class="rem-em">', "</em>");
  }

  if (symbol === "**" || symbol === "__") {
    return getTagAndValue(
      line,
      `${symbol == "**" ? "*" : "_"}`,
      '<strong class="rem-strong">',
      "</strong>",
      2
    );
  }

  if (symbol === "***" || symbol === "___") {
    return getTagAndValue(
      line,
      `${symbol == "***" ? "*" : "_"}`,
      '<strong class="rem-strong"><em class="rem-em">',
      "</em></strong>",
      3
    );
  }
}

function getHeading(line) {
  const poundSymbols = line.split("#").length - 1;
  let intermediateText = line.slice(poundSymbols + 1);

  while (1) {
    tagType = getTagType(intermediateText);

    if (tagType === "code") intermediateText = getCode(intermediateText);
    else if (tagType === "bold_italic")
      intermediateText = getBoldAndItalics(intermediateText);
    else break;
  }

  return `<h${poundSymbols} class=rem-h${poundSymbols}>${intermediateText}</h${poundSymbols}>`;
}

function getImage(line) {
  return `<img class="rem-img" src="${line.slice(
    line.indexOf("(") + 1,
    line.indexOf(")")
  )}" alt="${line.slice(line.indexOf("[") + 1, line.indexOf("]"))}"/>`;
}

function getLink(line) {
  let isOpeningText = false;
  let isOpeningLink = false;
  let link = "";
  let linkText = "";
  let intermediateText = "";

  for (const letter of line.split("")) {
    if (letter === "[") {
      isOpeningText = true;
    } else if (letter === "]") {
      isOpeningText = false;
    } else if (isOpeningText) {
      linkText += letter;
    } else if (letter === "(") {
      isOpeningLink = true;
    } else if (letter === ")") {
      isOpeningLink == false;
      intermediateText += `<a class="rem-a" href="${link}">${linkText}</a>`;
      link = "";
      linkText = "";
    } else if (isOpeningLink) {
      link += letter;
    } else {
      intermediateText += letter;
    }
  }

  while (1) {
    tagType = getTagType(intermediateText);

    if (tagType === "code") intermediateText = getCode(intermediateText);
    else if (tagType === "bold_italic")
      intermediateText = getBoldAndItalics(intermediateText);
    else break;
  }

  return intermediateText;
}

function getBlockQuote(line) {
  return `<blockquote class="rem-blockquote">${line.slice(2)}</blockquote>`;
}

function getCodeFence() {
  if (!isCodeFence) {
    isCodeFence = true;
    codeFence += "\n";
    return;
  }

  if (isCodeFence) {
    isCodeFence = false;
    tagValue = `<code class="rem-code">${codeFence}</code>`;
    codeFence = "";
    return tagValue;
  }
}

function getParagraph(line) {
  let intermediateText = "";

  if (isCodeFence) {
    codeFence += `${line}\n`;
    return;
  }

  intermediateText = line;
  while (1) {
    tagType = getTagType(intermediateText);

    if (tagType === "code") intermediateText = getCode(intermediateText);
    else if (tagType === "bold_italic")
      intermediateText = getBoldAndItalics(intermediateText);
    else if (tagType === "link") intermediateText = getLink(intermediateText);
    else break;
  }

  return `<p class="rem-p">${intermediateText}</p>`;
}

/**************************************/
/* GET TAG AND VALUE */
/**************************************/

function getTagAndValue(line, delimiter, tagBegin, tagEnd, totalSymbolCount) {
  let word = "",
    result = "",
    isDelimiter = false,
    symbolCount = 0;

  for (const letter of line.split("")) {
    if (isDelimiter) {
      if (letter == delimiter) {
        symbolCount += 1;
        if (symbolCount == totalSymbolCount) {
          result += `${tagBegin}${word}${tagEnd}`;
          isDelimiter = false;
          word = "";
          symbolCount = 0;
        }
        continue;
      }
      word += letter;
      continue;
    }

    if (letter == delimiter) {
      symbolCount += 1;
      if (symbolCount == totalSymbolCount) {
        isDelimiter = true;
        symbolCount = 0;
      }
      continue;
    }

    result += letter;
  }

  return result;
}

/**************************************/
/* GET TAG TYPE */
/**************************************/

function getTagType(line) {
  if (line.includes("#")) return "heading";
  else if (line && line.includes("```")) return "code_fence";
  else if (line.includes("`")) return "code";
  else if (line && line.includes(">") && !line.includes("</"))
    return "blockquote";
  else if (line && (line.includes("---") || line.includes("***")))
    return "horizontal_line";
  else if (
    line &&
    line.includes("[") &&
    line.includes("]") &&
    !line.includes("!")
  )
    return "link";
  else if (
    line &&
    line.includes("[") &&
    line.includes("]") &&
    line.includes("!")
  )
    return "image";
  else if (line.includes("*") || line.includes("_")) return "bold_italic";
  else if (line) return "paragraph";
  else if (!line) return "blank";
  else return "none";
}

/**************************************/
/* GET HTML */
/**************************************/

function getHTML(line) {
  tagType = getTagType(line);

  switch (tagType) {
    case "heading":
      return getHeading(line);

    case "code_fence":
      return getCodeFence();

    case "code":
      return getParagraph(line);

    case "bold_italic":
      return getParagraph(line);

    case "horizontal_line":
      return `<hr/>`;

    case "link":
      return getParagraph(line);

    case "image":
      return getImage(line);

    case "paragraph":
      return getParagraph(line);

    case "blockquote":
      return getBlockQuote(line);

    case "blank":
      return;

    default:
      return;
  }
}

/**************************************/
/* PARSER */
/**************************************/

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

    /* DELETE FILE */

    fs.unlink(mdPath, (error) => {
      if (error)
        console.log(`Something Went Wrong (Delete File) : Error ${error}`);
    });

    return tags;
  } catch (error) {
    console.log(`Something Went Wrong (Parser) : Error ${error}`);
  }
}

module.exports = ParserMD;

/**************************************/
/* EOF */
/**************************************/
