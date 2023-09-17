/* APP */

const path = require("path");
const express = require("express");
const morgan = require("morgan");

const viewRouter = require("./router/viewRouter");

const app = express();

/* MIDDLEWARES */

if (process.env.NODE_ENV == "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* SET UP PUG */

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/* MOUNTING ROUTES */

app.use("/", viewRouter);

module.exports = app;
