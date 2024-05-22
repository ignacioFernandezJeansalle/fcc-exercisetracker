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
app.use(bodyParser.urlencoded({ extended: false }));

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
  const { description } = req.body;
  const duration = parseInt(req.body.duration) || 0;
  const date = validateOrCompleteDate(req.body.date);

  try {
    const user = await User.findById(_id);
    if (!user) return res.json({ error: "error id" });

    const newExcercise = new Exercise({ user_id: user._id, description: description, duration: duration, date: date });

    const excerciseSave = await newExcercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: excerciseSave.description,
      duration: excerciseSave.duration,
      date: excerciseSave.date,
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "error read or save database" });
  }
});

// GET => Logs de ejercicios para un usuario x Id
/* app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;

  LogModel.findById({ _id: _id })
    .then((doc) => {
      if (!doc) return res.json({ error: "error id" });

      res.json(doc);
    })
    .catch((e) => {
      console.error(e);
      res.json({ error: "error read database" });
    });
}); */

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("--------------------------------------");
  console.log("Your app is listening on port " + listener.address().port);
  console.log("--------------------------------------");
});
