const mongoose = require("mongoose");
require("dotenv").config();

exports.dbconnect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully"))

    .catch((error) => {
      console.log(error);
      console.log("Something went Wrong During Database Connection");
      process.exit(1);
    });

};
