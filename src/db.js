const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    
  } catch (error) {
    process.exit(1);
  }
};

module.exports = { connectDB };
