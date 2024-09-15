const express = require("express");
const app = express();
const proxy = require("express-http-proxy");
const cors = require("cors");

const PORT = process.env.PORT;

app.use((req, res, next) => {
  console.log("HIT -", req.method, req.url);
  next();
});

app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.use(
  proxy((req) => {
    const hostname = req.hostname;
    console.log("PROXIED -", req.method, hostname);
    return hostname;
  })
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
