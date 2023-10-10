const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const { JWT_REFRESH_SECRET } = require("./credentials");
const googleStrategy = require("./strategies/google.strategy");
const getTokens = require("./utils");
const authenticateAccessToken = require("./middlewares/authenticate-access-token.middleware");

const app = express();

app.use(express.json()); // Добавим для обработки JSON в запросах
app.use(passport.initialize());

passport.use(googleStrategy);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    // Set refreshToken in cookie
    res.cookie("refreshToken", req.user.refreshToken, { httpOnly: true });

    // Respond with only the necessary information
    res.json({
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken,
      userData: req.user.userData,
    });
  }
);

//путь защищен с помощью authenticateAccessToken
app.get("/protected-route", authenticateAccessToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user.userData });
});

app.post("/refresh-tokens", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const { accessToken, newRefreshToken } = getTokens(user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  });
});

const PORT = 3000;

const start = async () => {
  await mongoose.connect(
    "mongodb+srv://emilevi4:QKNlcjPJe7LyHxq6@my-cluster.x0cjd1e.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  app.listen(PORT, () => {
    console.log(`Auth service is running at ${PORT}`);
  });
};

start();
