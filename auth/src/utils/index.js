const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../credentials");
const jwt = require("jsonwebtoken");

const getTokens = (userData) => {
  if (userData.password) {
    delete userData.password;
  }
  const accessToken = jwt.sign({ userData }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userData }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

module.exports = getTokens;
