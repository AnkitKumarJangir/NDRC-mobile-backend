const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URL,

  (err) => {
    if (!err) {
      console.log("Connection Successful");
    } else {
      console.log("Error in connection" + err);
    }
  }
);

module.exports = mongoose;
