const jwt = require("jsonwebtoken");

// Generates a JSON Web Token (JWT) containing the user ID and an expiration time of 1 day
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = { generateToken };