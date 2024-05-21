const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("--------------------------------------");
    console.log("Database connected");
    console.log("--------------------------------------");
  })
  .catch((err) => console.error(err));

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String,
});

const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [exerciseSchema],
});

const LogModel = mongoose.model("Log", logSchema);

module.exports = { LogModel };
