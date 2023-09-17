/* VIEW CONTROLLER */

/* FOR FILE UPLOAD */
const formidable = require("formidable");

const fs = require("fs");
const markdownToHTML = require("../util/rem");

const remHTMLPath = `/${__dirname
  .split("/")
  .slice(1, -1)
  .join("/")}/public/html/rem.html`;

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
      .join("/")}/public/txt/${files.file[0].originalFilename}`;

    fs.rename(oldPath, newPath, (error) => {
      if (error) throw error;
    });

    await markdownToHTML(newPath);

    return res.status(200).render("success");
  });
};

/* RENDER PARSED MD */

exports.renderMD = (req, res) => {
  return res.status(200).sendFile(remHTMLPath);
};

/* RENDER ERROR PAGE */

exports.getError = (req, res) => {
  return res.status(200).render("error");
};
