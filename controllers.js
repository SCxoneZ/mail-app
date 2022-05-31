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
  },
  {
    link: "/profile",
    title: "Profile"
  }];


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
    profile: (req, res) => {
      res.render("index", {
        title: "Profile",
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
      res.cookie('isLogin', 'yes', {
        expires: new Date(Date.now() + 900000), httpOnly: true
      })
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
          password: req.body.password
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
    }
  }
};