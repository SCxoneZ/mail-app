const { encKey } = require("../config");
const { createHmac } = require("crypto");

function encrypt(text){
  const hmac = createHmac("sha256", encKey).update(text).digest("hex");
  return hmac;
}

module.exports = encrypt;