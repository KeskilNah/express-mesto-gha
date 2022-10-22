const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const { notFoundController } = require("./controllers/NotFoundControllers");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "634bde7f0afbdd3c4766ec76",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.use("*", notFoundController);

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
