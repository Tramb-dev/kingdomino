const express = require("express");
const db = require("./db");
const path = require("path");

const webSocketServer = require("socket.io")();
require("./socket")(webSocketServer);

const app = express();
const PORT = process.env.PORT || 8080;
const ROOT = path.dirname(__dirname);
const publicPath = path.normalize(ROOT + "/dist/kingdomino");

const documents = {}; // A remplacer par la suite par la gestion en bdd

app.use(express.static(publicPath));
app.use("/assets/images", express.static(publicPath + "/assets"));

app.use((req, res) => {
  res.sendFile(path.normalize(publicPath + "/index.html"));
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

const httpServer = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port : ${PORT}`);
});

webSocketServer.attach(httpServer);
