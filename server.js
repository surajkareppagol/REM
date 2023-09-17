const mongoose = require("mongoose");

const dotenv = require("dotenv");

/* READ ENV VARIABLES */

dotenv.config({
  path: "./.env",
});

const app = require("./app");

/* CONNECT TO DB */

const DB = process.env.DB_CONNECTION.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((connection) => {
    console.log("Connected to DB.");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});
