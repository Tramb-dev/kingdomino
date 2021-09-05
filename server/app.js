const express = require("express");
const path = require("path");
const dominoes = require("./dominoes/dominoes.json");

const webSocketServer = require("socket.io")();
require("./socket")(webSocketServer);

const app = express();
const PORT = process.env.PORT || 8080;
const ROOT = path.dirname(__dirname);
const publicPath = path.normalize(ROOT + "/dist/kingdomino");

app.use(express.static(publicPath));
app.use("/assets/images", express.static(publicPath + "/assets"));

app.get("/dominoes", (req, res) => {
  res.json(dominoes);
});

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
