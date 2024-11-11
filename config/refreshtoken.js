const jwt = require("jsonwebtoken");

// Generates a JSON Web Token (JWT) refresh token containing the user ID and an expiration time of 3 days
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };