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
/* app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description } = req.body;
  const duration = parseInt(req.body.duration) || 0;
  const date = validateOrCompleteDate(req.body.date);

  const newExcercise = { date: date, duration: duration, description: description };

  // Buscar por id y actualizar
  LogModel.findById({ _id: _id })
    .then((doc) => {
      if (!doc) return res.json({ error: "error id" });

      doc.log.push(newExcercise);

      return doc.save();
    })
    .then((doc) => {
      res.json({ _id: doc._id, username: doc.username, ...newExcercise });
    })
    .catch((e) => {
      console.error(e);
      res.json({ error: "error read and save database" });
    });
}); */

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
