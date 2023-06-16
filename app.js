const express = require("express");
const app = express();
const port = 7000;



// Set the view engine to EJS and serve static files from the public folder
app.set("view engine", "ejs");
app.use(express.static("public"));

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for managing user sessions using cookies and express-session
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: "strict" },
  })
);



// Require Mongoose and connect to the database
const mongoose = require("mongoose");
mongoose
  .connect(
    "",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`CDI app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// For auto-refresh, use livereload to watch for changes and refresh the page
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

// Handle the root URL by redirecting to the home page
app.get("/", (req, res) => {
  res.redirect("/home");
});

// home page route - render the home view
app.get("/home", (req, res) => {
  res.render("home");
});


app.get("/works", (req, res) => {
  res.render("works");
});

app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});

app.get("/about-us", (req, res) => {
  res.render("about-us");
});
