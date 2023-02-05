//  to controll ur website

const express = require("express");
const app = express();
const port = 5000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const Article = require("./models/articleSchema");
const mongoose = require("mongoose");


// for auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// mongoose


mongoose.connect(
    "mongodb+srv://ammar:alibrahim@cluster0.51i7rk6.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })

  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.redirect("/home");
});


app.get("/home", (req, res) => {
  res.render("index");
});




app.post("/home", (req, res) => {
  // form verilerinin alınması
  const { title, summary, number, shoesname, body } = req.body;

  // veri nesnesi oluşturma
  const order = new Article({ title, summary, number, shoesname, body });

  // veri nesnesinin veritabanına kaydedilmesi
  order.save()
    .then(() => {
      // kayıt başarılı ise /home sayfasına yönlendirme
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});



app.get("/all-shoes", (req, res) => {
  res.render("all-shoes");
});


app.get("/nike-jordan", (req, res) => {
  res.render("nike-jordan");
});



//  404
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});
