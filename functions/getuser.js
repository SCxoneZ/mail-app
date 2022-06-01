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

async function getuser(username, password) {
  const data = await knex("users")
  .select("*")
  .where("username", "=", username, "AND", "password", "=", password);
  return data;
}

module.exports = getuser;