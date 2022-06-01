const express = require("express");
const app = express();
//const { index, sendMail, profile, checkMails, loginPage, registerPage} = require("./controllers");
const { get, post, middleware } = require("./controllers");
const cookieParser = require("cookie-parser");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(middleware);

// GET
app.get("/", get.index);
app.get("/send", get.sendMail);
app.get("/mails", get.checkMails);
app.get("/login", get.loginPage);
app.get("/register", get.registerPage);

// POST
app.post("/register", post.registerPage);
app.post("/login", post.loginPage);

app.listen(PORT, () => console.log("Listening Now..."));