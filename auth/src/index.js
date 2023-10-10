const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const { JWT_REFRESH_SECRET, MONGO_URL } = require("./credentials");
const googleStrategy = require("./strategies/google.strategy");
const getTokens = require("./utils");
const authenticateAccessToken = require("./middlewares/authenticate-access-token.middleware");
const localStrategy = require("./strategies/local.strategy");
const User = require("./models/User");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json()); // Добавим для обработки JSON в запросах
app.use(cookieParser());
app.use(passport.initialize());

passport.use(googleStrategy);
passport.use(localStrategy);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    res.cookie("refreshToken", req.user.refreshToken, { httpOnly: true });

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

// app.get("/login/callback", req);

app.post(
  "/auth/signin",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    // Вход выполнен успешно
    res.cookie("refreshToken", req.user.refreshToken, { httpOnly: true });

    res.json({
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken,
      userData: req.user.userData,
    });
  }
);

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, displayName, password } = req.body;
    const user = new User({ email, displayName });
    await user.setPassword(password);
    await user.save();

    const { accessToken, refreshToken } = getTokens(user);

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    // Регистрация выполнена успешно
    res.status(201).json({ accessToken, refreshToken, userData: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const tokens = getTokens(user.userData);

    // console.log(tokens);

    res.json({ ...tokens, user: user.userData });
  });
});

const PORT = 3000;

const start = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => {
    console.log(`Auth service is running at ${PORT}`);
  });
};

start();
