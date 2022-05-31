const express = require("express");
const app = express();
//const { index, sendMail, profile, checkMails, loginPage, registerPage} = require("./controllers");
const { get, post } = require("./controllers");
const cookieParser = require("cookie-parser");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log(req.cookies);
  
  next();
});

app.set("view engine", "ejs");

// GET
app.get("/", get.index);
app.get("/send", get.sendMail);
app.get("/profile", get.profile);
app.get("/mails", get.checkMails);
app.get("/login", get.loginPage);
app.get("/register", get.registerPage);

// POST
app.post("/register", post.registerPage);

app.listen(PORT, () => console.log("Listening Now..."));