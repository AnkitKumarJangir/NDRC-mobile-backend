const dotenv = require("dotenv");
const app = require("./src/app");
const db = require("./src/db");
dotenv.config();

const PORT = process.env.PORT || 5000;

db.connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => console.log(error));
