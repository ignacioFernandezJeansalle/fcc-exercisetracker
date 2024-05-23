const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./src/mongoose");
const bodyParser = require("body-parser");
const { User, Exercise } = require("./src/mongoose");
const { validateOrCompleteDate } = require("./src/utils");

app.use(cors());
app.use(express.static("public"));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// GET => Todos los usuarios
// POST => Nuevo usuario
app
  .route("/api/users")
  .get(async (req, res) => {
    try {
      const listOfUsers = await User.find({});
      res.json(listOfUsers);
    } catch (err) {
      console.error(err);
      res.json({ error: "error read database" });
    }
  })
  .post(async (req, res) => {
    const { username } = req.body;

    if (!username) return res.json({ error: "invalid user" });

    const newUser = new User({ username: username });

    try {
      const userSave = await newUser.save();
      res.json(userSave);
    } catch (err) {
      console.error(err);
      res.json({ error: "error save database" });
    }
  });

// POST => Nuevo ejercicio x Id
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration } = req.body;
  let { date } = req.body;

  // Parche porque no pasa el test desde Argentina por como guarda la hora :(
  if (!date) {
    date = new Date();
  } else {
    const parts = date.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    const utcDate = new Date(Date.UTC(year, month, day));
    date = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  }

  try {
    const user = await User.findById(_id);
    if (!user) return res.json({ error: "error user id" });

    const newExcercise = new Exercise({
      user_id: user._id,
      description,
      duration,
      date,
    });

    const excerciseSave = await newExcercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      description: excerciseSave.description,
      duration: excerciseSave.duration,
      date: new Date(excerciseSave.date).toDateString(),
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "error read or save database" });
  }
});

// GET => Logs de ejercicios para un usuario x Id
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) return res.json({ error: "error user id" });

    // filter
    let dateFilter = {};
    if (from) {
      dateFilter["$gte"] = new Date(from);
    }
    if (to) {
      dateFilter["$lte"] = new Date(to);
    }
    let filter = { user_id: user._id };
    if (from || to) {
      filter.date = dateFilter;
    }

    // limit
    const limitInt = limit ? parseInt(limit) : 50;

    const exercises = await Exercise.find(filter).limit(limitInt);

    const log = exercises.map((exercise) => {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      };
    });

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: log,
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "error read database" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("--------------------------------------");
  console.log("Your app is listening on port " + listener.address().port);
  console.log("--------------------------------------");
});
