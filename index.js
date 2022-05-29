const express = require("express");
const app = express();
const { index, sendMail, profile, checkMails, loginPage} = require("./controllers");
const cookieParser = require("cookie-parser");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.cookies);
  if(!req.cookies.isLogin && req.path !== "/login"){
    res.redirect("/login");
  }
  next();
});

app.set("view engine", "ejs");

app.get("/", index);
app.get("/send", sendMail);
app.get("/profile", profile);
app.get("/mails", checkMails);
app.get("/login", loginPage);


app.listen(PORT, () => console.log("Listening Now..."));