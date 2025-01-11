const dotenv = require("dotenv");
const app = require("./app");
const db = require("./db");
dotenv.config();

const PORT = process.env.PORT || 3000;

db.connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => console.log(error));
