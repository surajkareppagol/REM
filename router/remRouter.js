const express = require("express");
const remController = require("../controller/remController");

const router = express.Router();

router.route("/").get(remController.parseMarkdown);

module.exports = router;
