//  to controll ur website

const express = require("express");
const app = express();
const port = 3000;
const helmet = require("helmet");

app.set("view engine", "ejs");
app.use(express.static("public"));
const bcrypt = require("bcrypt");
app.use(express.urlencoded({ extended: true }));
const Contact = require("./models/ContactSchema");
const User = require("./models/UserSchema");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

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
    app.listen(process.env.PORT || port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })

  .catch((err) => {
    console.log(err);
  });

app.use(helmet());

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
  const contact = new Contact({ title, summary, number, shoesname, body });

  // veri nesnesinin veritabanına kaydedilmesi
  contact
    .save()
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.error(err);
      res.send("Veritabanına kaydetme sırasında hata oluştu.");
    });
});

app.get("/all-shoes", (req, res) => {
  Contact.find()
    .then((articles) => {
      res.render("all-shoes", { articles });
    })
    .catch((err) => {
      console.error(err);
      res.send("Verileri çekme sırasında hata oluştu.");
    });
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.render("user", { user: req.session.user });
  }
});

// Signup Route
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      res.send("Parola şifrelenirken hata oluştu.");
    } else {
      User.create({ username, email, password: hash })
        .then((user) => {
          req.session.user = user;
          res.redirect("/user");
        })
        .catch((err) => {
          console.error(err);
          res.send("Kullanıcı kaydetme sırasında hata oluştu.");
        });
    }
  });
});

// Login Route
app.get("/login", (req, res) => {
  res.render("login");
});

// setting the user object in session after successful login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .then((user) => {
      if (user) {
        req.session.user = user;
        res.redirect("/user");
      } else {
        res.send("Email veya şifre yanlış.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.send("Giriş sırasında hata oluştu.");
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
