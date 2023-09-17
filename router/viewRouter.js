/* VIEW ROUTER */

const express = require("express");
const router = express.Router();

const viewController = require("../controller/viewController");

router.route("/").get(viewController.getHome);
router.route("/upload").post(viewController.uploadAndParseMD);
router.route("/render-md").get(viewController.renderMD);

/* SERVE ALL OTHER ROUTES WITH ERROR PAGE */

router.route("*").get(viewController.getError);

module.exports = router;
