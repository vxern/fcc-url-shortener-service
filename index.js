require("dotenv").config();
const validator = require("validator");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urls = [];

app.get("/api/shorturl/:shortUrl", (request, response) => {
  const { shortUrl: shortUrlString } = request.params;

  const shortUrl = Number(shortUrlString);
  const originalUrl = urls[shortUrl];

  return response.redirect(originalUrl);
});

app.post("/api/shorturl", async (request, response) => {
  const { url } = request.body;

  if (!validator.isURL(url)) {
    return response.json({ "error": "invalid url" });
  }

  const id = urls.length;
  urls[id] = url;

  return response.json({ "original_url": url, "short_url": id.toString() });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
