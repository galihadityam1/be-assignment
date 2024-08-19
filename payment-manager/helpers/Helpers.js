const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "minji";

class Helpers {
  static comparedPassword(plainPass, hashedPass) {
    return bcrypt.compareSync(plainPass, hashedPass);
  }

  static signToken(payload) {
    return jwt.sign(payload, secret);
  }

  static verifyToken(token) {
    return jwt.verify(token, secret);
  }
}

module.exports = { Helpers };
