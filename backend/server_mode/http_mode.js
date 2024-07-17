const http = require("http");
const io = require("socket.io");
const cors = require("cors");

const startHttpServer = (app, port) => {
  const server = http.createServer(app);
  const ioServer = io(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  module.exports.io = ioServer;

  // cors
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  server.listen(port, () => {
    console.clear();
    console.log(`~> Backend online on port ${port}`);
    console.log(`~> Http Mode`);
  });
};

module.exports = { startHttpServer };
