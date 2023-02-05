//  to controll ur website

const express = require("express");
const app = express();
const port = 5000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const Article = require("./models/articleSchema");
const User = require("./models/UserSchema");
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

mongoose
  .connect(
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
  res.render("home");
});

app.post("/home", (req, res) => {
  // form verilerinin alınması
  const { title, summary, number, shoesname, body } = req.body;

  // veri nesnesi oluşturma
  const order = new Article({ title, summary, number, shoesname, body });

  // veri nesnesinin veritabanına kaydedilmesi


  order
  .save()
  .then(() => {
    User.find()
      .then((result) => {
        res.render("home");
      })
      .catch((err) => { 
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });


});

app.get("/all-shoes", (req, res) => {
  res.render("all-shoes");
});



app.get("/user", (req, res) => {
  res.render("user");
});







// Signup Route
app.get("/signup", (req, res) => {
  res.render("signup");
  });
  
  app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    User.create({ username, email, password })
    .then((user) => {
    res.render("user", { user });
    })
    .catch((err) => {
    console.log(err);
    });
    });
  
  // Login Route
  app.get("/login", (req, res) => {
  res.render("login");
  });
  
  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email, password })
    .then((user) => {
    if (user) {
    res.render("user", { user });
    } else {
    res.render("login", { message: "Kullanıcı adı veya şifre yanlış" });
    }
    })
    .catch((err) => {
    console.log(err);
    });
    });














//  404
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});
