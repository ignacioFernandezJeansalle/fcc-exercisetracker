const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./src/mongoose");
const bodyParser = require("body-parser");
const { LogModel } = require("./src/mongoose");
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
  .get((req, res) => {
    LogModel.find({})
      .then((q) => {
        const listOfUsers = q.map((doc) => {
          return { username: doc.username, _id: doc._id };
        });
        res.json(listOfUsers);
      })
      .catch((e) => {
        console.error(e);
        res.json({ error: "error read database" });
      });
  })
  .post((req, res) => {
    const { username } = req.body;

    if (!username) return res.json({ error: "invalid user" });

    const newLog = new LogModel({
      username: username,
      count: 0,
      log: [],
    });

    newLog
      .save()
      .then((doc) => {
        res.json({ username: doc.username, _id: doc._id });
      })
      .catch((e) => {
        console.error(e);
        res.json({ error: "error save database" });
      });
  });

// POST => Nuevo ejercicio x Id
app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description } = req.body;
  const duration = parseInt(req.body.duration) || 0;
  const date = validateOrCompleteDate(req.body.date);

  const newExcercise = { description: description, duration: duration, date: date };

  // Buscar por id y actualizar
  LogModel.findById({ _id: _id })
    .then((doc) => {
      if (!doc) return res.json({ error: "error id" });

      doc.log.push(newExcercise);

      return doc.save();
    })
    .then((doc) => {
      res.json({ username: doc.username, ...newExcercise, _id: doc._id });
    })
    .catch((e) => {
      console.error(e);
      res.json({ error: "error read and save database" });
    });
});

// GET => Logs de ejercicios para un usuario x Id
app.get("/api/users/:_id/logs", (req, res) => {
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
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("--------------------------------------");
  console.log("Your app is listening on port " + listener.address().port);
  console.log("--------------------------------------");
});
