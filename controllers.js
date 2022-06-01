const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mail'
  }
});

const encrypt = require("./functions/encrypt");
const getuser = require("./functions/getuser");

const nav_links = [{
  link: "/",
  title: "Home"
},
  {
    link: "/mails",
    title: "Check Mails",
  },
  {
    link: "/send",
    title: "Send Mail"
  }
  ];


module.exports = {
  get: {
    index: (req, res) => {
      res.render("index", {
        title: "Home",
        nav_links
      });
    },
    sendMail: (req, res) => {
      res.render("index", {
        title: "Send Mail",
        nav_links
      });
    },
    checkMails: (req, res) => {
      res.render("index", {
        title: "Check Mails",
        nav_links
      });
    },
    loginPage: (req, res) => {
      res.render("login", {
        title: "Login Section"
      });
    },
    registerPage: (req, res) => {
      res.render("register", {
        title: "Register Section"
      });
    }
  },
  post: {
    registerPage: (req, res) => {
      if (req.body.username && req.body.publicKey && req.body.password) {
        const data = {
          id: 0,
          username: req.body.username,
          profile: "",
          publicKey: req.body.publicKey,
          password: encrypt(req.body.password)
        };
        knex('users').insert(data).then(() => {
          res.render("register", {
            title: "Register Section",
            registered: true
          });
        })
        .catch((err) => {
          res.render("register", {
            title: "Register Section",
            error: true
          });
          throw err
        })
        .finally(() => {
          knex.destroy();
        });
      }
    },
    loginPage: (req, res) => {
      knex("users")
      .select("*")
      .where("username", "=", req.body.username)
      .then(rows => {
        if (rows.length > 0) {

          if (encrypt(req.body.password) == rows[0].password && req.body.username == rows[0].username) {
            // set cookies for 1 month
            res.cookie('key', encrypt(req.body.password), {
              expires: new Date(Date.now() + 3600000 * (24*30)), httpOnly: true
            });
            res.cookie('username', req.body.username, {
              expires: new Date(Date.now() + 3600000 * (24*30)), httpOnly: true
            });
            res.redirect("/");
          } else {
            res.render("login", {
              title: "Login Section",
              fail: true
            });
          }

        } else {
          res.render("login", {
            title: "Login Section",
            fail: true
          });
        }
      });
    }
  },
  middleware: (req, res, next) => {
    switch (req.path) {
      case "/":
      case "/send":
      case "/profile":
      case "/mails":
        if (!req.cookies.key || !req.cookies.username) {
          res.clearCookie("key");
          res.clearCookie("username");
          res.redirect("/login");
        }
        break;
      case "/register":
      case "/login":
        if (req.cookies.key) {
          res.redirect("/");
        }
        break;
    }
    next();
  }
};