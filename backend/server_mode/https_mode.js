const fs = require("fs");
const https = require("https");
const io = require("socket.io");
const cors = require("cors");

const startHttpsServer = (app, port) => {
  const options = {
    key: fs.readFileSync("../ssl/server.key"),
    cert: fs.readFileSync("../ssl/server.crt"),
  };
  const server = https.createServer(options, app);

  // Ubah ini menjadi array
  const allowedOrigins = [
    "https://www.growtovia.com",
    "https://growtovia.com",
    "https://api.growtovia.com"
  ];

  // socket io
  const ioServer = io(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        const isDirectIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(origin);
        if (isDirectIP) {
          console.log(`${origin} mencoba mengakses server`);
        } else {
          console.log(`${origin} mencoba mengakses server (notDirectIP)`);
        }
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  };

  module.exports.io = ioServer;

  // cors
  app.use(cors(corsOptions));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api-system2131230fsmLLLL")) {
      return next();
    }
    const origin = req.get("origin");
    let ip = req.ip;

    // Mengambil hanya bagian IPv4 dari alamat IP
    if (ip && ip.substr(0, 7) === "::ffff:") {
      ip = ip.substr(7);
    }

    if (!allowedOrigins.includes(origin)) {
      console.log(`Request from ${origin} is blocked`);
      console.log(`Ip address : ${ip}`);
      return res.status(403).send("Forbidden");
    }

    next();
  });

  server.listen(port, () => {
    console.clear();
    console.log(`~> Backend online SSL Active on port ${port}`);
    console.log(`~> Https Mode`);
  });
};

module.exports = { startHttpsServer };