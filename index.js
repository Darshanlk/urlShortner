const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

console.log(process.env.PORT);
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
// app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  const url = req.body.fullurl;
  const data = await ShortUrl.create({ full: url });
  console.log(data);

  res.redirect("/");
});

//to work small url we use this route  but this is bottom of route
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});
app.listen(process.env.PORT || 5000);
