// app.js
const express = require("express");
const bodyParser = require("body-parser");
const scrapperChannel = require("./scrapper");
const cors=require('cors')
const app = express();
const port = 8080;
// app.use(cors())
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type"); // Correct header for allowing Content-Type
    next();
});


app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL not provided" });
  }

  try {
    const scrapedData = await scrapperChannel(url);
    res.status(200).json({ data: scrapedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); // Send the specific error message
  }
});


app.listen(port, () => {
  console.log("app is listening on port", port);
});
