const express = require("express");
const app = express();
const proxy = require("express-http-proxy");
const cors = require("cors");

const PORT = process.env.PORT;

app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.use(
  proxy((req) => {
    const hostname = req.hostname;
    console.log("HIT:", hostname);
    return hostname;
  })
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
