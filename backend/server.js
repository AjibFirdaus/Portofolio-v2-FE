const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const helmet = require("helmet");
const port = 8989;
require('dotenv').config();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(404);
  }
  next();
});

const { startHttpServer } = require("./server_mode/http_mode");
const { startHttpsServer } = require("./server_mode/https_mode");

const mode = "http";

if (mode === "http") {
  startHttpServer(app, port);
  const { io } = require("./server_mode/http_mode");
  module.exports.io = io;
} else if (mode === "https") {
  startHttpsServer(app, port);
  const { io } = require("./server_mode/https_mode");
  module.exports.io = io;
} else {
  console.error("~> Mode server tidak valid");
  process.exit();
}

// Endpoints
const apiAuthRouter = require("./endpoints/api-auth");
const apiSelectData = require("./endpoints/api-select-data");
const apiUpdateData = require("./endpoints/api-update-data");
const apiCreateData = require("./endpoints/api-create-data");
const apiDeleteData = require("./endpoints/api-delete-data")

app.use(express.static("public"));
app.use("/api-auth", apiAuthRouter);
app.use("/api-select", apiSelectData);
app.use("/api-update", apiUpdateData);
app.use("/api-create", apiCreateData);
app.use("/api-delete", apiDeleteData);


// Config
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "~> Backend Running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});