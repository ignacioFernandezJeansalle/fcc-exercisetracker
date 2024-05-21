const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./src/mongoose");
const bodyParser = require("body-parser");
const { LogModel } = require("./src/mongoose");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("--------------------------------------");
  console.log("Your app is listening on port " + listener.address().port);
  console.log("--------------------------------------");
});
