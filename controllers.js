const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'todo'
  }
});

const nav_links = [
  {
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
    res.cookie('isLogin', 'yes', { expires: new Date(Date.now() + 900000), httpOnly: true })
    res.render("login", {
      title: "Login Section"
    });
  }
};