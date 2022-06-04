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
  }];


module.exports = {
  get: {
    index: async (req, res) => {
      res.render("index", {
        title: "Home",
        nav_links,
        user: await getuser(req.cookies.username, req.cookies.key)
      });
    },
    sendMail: async (req, res) => {
      res.render("send", {
        title: "Send Mail",
        nav_links,
        user: await getuser(req.cookies.username, req.cookies.key)
      });
    },
    checkMails: async (req, res) => {
      res.render("index", {
        title: "Check Mails",
        nav_links,
        user: await getuser(req.cookies.username, req.cookies.key)
      });
    },
    loginPage: async (req, res) => {
      res.render("login", {
        title: "Login Section"
      });
    },
    registerPage: async (req, res) => {
      res.render("register", {
        title: "Register Section"
      });
    }
  },
  post: {
    registerPage: (req, res) => {
      if (req.body.username && req.body.publicKey && req.body.password && req.files.profile) {
        const fileExtension = req.files.profile.name.split(".");
        req.files.profile.name = Date.now() + "." + fileExtension[fileExtension.length-1];
        const data = {
          id: 0,
          username: req.body.username,
          profile: req.files.profile.name,
          publicKey: req.body.publicKey,
          password: encrypt(req.body.password)
        };
        knex('users').insert(data).then(() => {
          req.files.profile.mv(`./profiles/${req.files.profile.name}`, (err) => {
            if (err) {
              res.render("register", {
                title: "Register Section",
                error: true
              });
            }
          });
          res.render("register",
            {
              title: "Register Section",
              registered: true
            });
        })
        .catch((err) => {
          res.render("register",
            {
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
    },
    send: async (req, res) => {
      const user = await getuser(req.cookies.username, req.cookies.password);
      const date = new Date();
      knex("mails").insert({
        mailId: 0,
        fromUsername: user[0].username,
        fromKey: user[0].publicKey,
        toKey: req.body.toKey,
        content: req.body.content,
        time: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      })
      .then(rows => {
        res.render("send", {
          title: "Send Mail",
          nav_links,
          succeed: true,
          user
        });
      })
    }
  },
  middleware: (req,
    res,
    next) => {
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