const express = require("express");
const fileupload = require("express-fileupload");
const app = express();
//const { index, sendMail, profile, checkMails, loginPage, registerPage} = require("./controllers");
const { get, post, middleware } = require("./controllers");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = 3000;

app.use("/profiles", express.static("./profiles"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileupload());
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
app.post("/send", post.send);

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));