const path = require("path");
const express = require("express");
const morgan = require("morgan");

const remRouter = require("./router/remRouter");
const viewRouter = require("./router/viewRouter");

const app = express();

/* MIDDLEWARES */

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* SET UP PUG */

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/* MOUNTING ROUTES */

app.use("/", viewRouter);
app.use("/api/v1/upload-md", remRouter);

module.exports = app;
