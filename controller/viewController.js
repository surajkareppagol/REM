/* VIEW CONTROLLER */

/* FOR FILE UPLOAD */
const formidable = require("formidable");

const fs = require("fs");
const markdownToHTML = require("../util/rem");
let html = "";

exports.getHome = (req, res) => {
  return res.status(200).render("home");
};

/* FILE UPLOAD */

exports.uploadAndParseMD = (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    const oldPath = files.file[0].filepath;
    const newPath = `/${__dirname
      .split("/")
      .slice(1, -1)
      .join("/")}/public/md/${Date.now()}-${files.file[0].newFilename}-${
      files.file[0].originalFilename
    }`;

    fs.rename(oldPath, newPath, (error) => {
      if (error) throw error;
    });

    html = await markdownToHTML(newPath);

    return res.status(200).render("success");
  });
};

/* RENDER PARSED MD */

exports.renderMD = (req, res) => {
  return res.status(200).type("text/html").send(html);
};

/* RENDER ERROR PAGE */

exports.getError = (req, res) => {
  return res.status(200).render("error");
};
