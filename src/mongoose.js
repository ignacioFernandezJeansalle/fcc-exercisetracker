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

const UserSchema = new mongoose.Schema({
  username: String,
});

const User = mongoose.model("User", UserSchema);

const ExerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: String,
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

/* const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [ExerciseSchema],
});

const LogModel = mongoose.model("Log", logSchema); */

module.exports = { User, Exercise };
